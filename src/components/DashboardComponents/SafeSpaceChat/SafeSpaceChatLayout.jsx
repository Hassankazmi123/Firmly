import React, { useState, useEffect } from "react";
import SpaceChatContent from "./SpaceChatContent";
import SafeSpaceChatHeader from "./SafeSpaceChatHeader";
import SafeSpaceChatInput from "./SafeSpaceChatInput";
import { chatService } from "../../../services/chat";

const SafeSpaceChatLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem("safeSpaceChatSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("safeSpaceChatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [currentThread, setCurrentThread] = useState(() => {
    const saved = sessionStorage.getItem("safeSpaceChatCurrentThread");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    sessionStorage.setItem("safeSpaceChatSidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    sessionStorage.setItem("safeSpaceChatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("safeSpaceChatCurrentThread", JSON.stringify(currentThread));
  }, [currentThread]);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !isSidebarCollapsed) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isSidebarCollapsed]);

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { type: "user", text: message }]);
    setIsTyping(true);

    const isIncognito = process.env.REACT_APP_INCOGNITO_MODE === 'true';

    if (isIncognito) {
      try {
        console.log("Safe Space Chat: Sending incognito message", message);
        console.log("Safe Space Chat: Current thread before send", currentThread);

        let threadToUse = currentThread;
        if (!threadToUse) {
          console.log("Safe Space Chat: No thread found, creating a new one...");
          const title = message.length > 50 ? message.substring(0, 50) + "..." : message;
          const response = await chatService.createNewThread(true, title);
          console.log("Safe Space Chat: Create thread response:", response);

          let newThread = response.thread || response.data || response;
          if (newThread.thread_id && !newThread.id) {
            newThread.id = newThread.thread_id;
          }
          if (!newThread.id) throw new Error("Missing thread ID");
          setCurrentThread(newThread);
          threadToUse = newThread;
          console.log("Safe Space Chat: Set threadToUse to", threadToUse);
        }

        console.log("Safe Space Chat: Firing API call to send message...");
        const response = await chatService.sendIncognitoMessage(threadToUse.id, message);
        console.log("Safe Space Chat: Received response from sendIncognitoMessage:", response);

        setIsTyping(false);

        let aiText = "Sorry, I couldn't understand that.";
        if (response) {
          // Check typical fields directly first
          if (response.reply) aiText = response.reply;
          else if (response.response) aiText = response.response;
          else if (typeof response.message === 'string') aiText = response.message;
          else if (response.message && response.message.content) aiText = response.message.content;
          else if (response.text) aiText = response.text;
          else if (response.content) aiText = response.content;
          else if (response.data && response.data.reply) aiText = response.data.reply;
          else if (response.data && response.data.content) aiText = response.data.content;
          else if (response.data && response.data.message) aiText = response.data.message;
          else if (response.data && response.data.text) aiText = response.data.text;
          else {

            try {
              let maxStr = "";
              const searchObj = (obj) => {
                if (typeof obj === 'string') {

                  if (obj.length > maxStr.length && obj.length > 5 && obj !== threadToUse.id) maxStr = obj;
                } else if (Array.isArray(obj)) {
                  for (let i = 0; i < obj.length; i++) searchObj(obj[i]);
                } else if (typeof obj === 'object' && obj !== null) {
                  for (let key in obj) {
                    // Exclude metadata keys usually representing internal state
                    if (key !== 'id' && key !== 'role' && key !== 'thread_id') {
                      searchObj(obj[key]);
                    }
                  }
                }
              };
              searchObj(response);
              if (maxStr) aiText = maxStr;
              else aiText = typeof response === 'string' ? response : JSON.stringify(response); // Complete fallback
            } catch (e) {
              aiText = JSON.stringify(response);
            }
          }
        } else {
          aiText = "No response from AI.";
        }

        console.log("Safe Space Chat: Setting AI text mapped from response:", aiText);
        setMessages((prev) => {
          return [
            ...prev,
            {
              type: "ai",
              text: aiText,
            },
          ];
        });

      } catch (error) {
        setIsTyping(false);
        console.error("Safe Space Chat: Failed to send incognito message:", error);
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "Sorry, there was an error connecting to the server.",
          },
        ]);
      }
    } else {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program. Developing empathy is an ongoing journey, and the awareness and commitment you've shown are significant steps. How are you feeling about our work together so far?",
          },
        ]);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden ">
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-[#ECECEC] relative h-full">
        <img
          src="/assets/images/dashboard/normaltop.webp"
          alt="dashboard top background"
          className="absolute top-0 left-0 w-[337px] z-0 h-[348px] object-cover object-top pointer-events-none"
        />
        <SafeSpaceChatHeader
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          hasMessages={messages.length > 0}
        />
        <div className="flex-1 overflow-hidden">
          <SpaceChatContent messages={messages} isTyping={isTyping} />
        </div>
        <div className="flex-shrink-0">
          <SafeSpaceChatInput
            onSendMessage={handleSendMessage}
          />
        </div>
        <img
          src="/assets/images/dashboard/safechatbottom.webp"
          alt="dashboard bottom background"
          className="absolute bottom-0 right-0 w-[546px] z-0 h-[400px] object-cover object-bottom pointer-events-none"
        />
      </div>
    </div>
  );
};

export default SafeSpaceChatLayout;
