import React, { useState, useEffect } from "react";
import SpaceChatContent from "./SpaceChatContent";
import SafeSpaceChatHeader from "./SafeSpaceChatHeader";
import SafeSpaceChatInput from "./SafeSpaceChatInput";

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

  // Save sidebar state
  useEffect(() => {
    sessionStorage.setItem("safeSpaceChatSidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Save messages state
  useEffect(() => {
    sessionStorage.setItem("safeSpaceChatMessages", JSON.stringify(messages));
  }, [messages]);

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
            onSendMessage={(message) => {
              setMessages([...messages, { type: "user", text: message }]);
              setIsTyping(true);
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
            }}
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
