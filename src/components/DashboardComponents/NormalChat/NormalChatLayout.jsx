import React, { useState, useEffect } from "react";
import NormalChatSidebar from "./NormalChatSidebar";
import NormalChatHeader from "./NormalChatHeader";
import NormalChatContent from "./NormalChatContent";
import NormalChatInput from "./NormalChatInput";
import { chatService } from "../../../services/chat";
import { getUserProfile } from "../../../services/api";

const NormalChatLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem("normalChatSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(() => {
    const saved = sessionStorage.getItem("normalChatCurrentThread");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [error, setError] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  // Save sidebar state
  useEffect(() => {
    sessionStorage.setItem("normalChatSidebarCollapsed", JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Save current thread state
  useEffect(() => {
    sessionStorage.setItem("normalChatCurrentThread", JSON.stringify(currentThread));
  }, [currentThread]);

  // Fetch threads on mount
  useEffect(() => {
    fetchThreads();
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        if (data) {
          const first = data.first_name || "";
          const last = data.last_name || "";
          if (first && last) {
            setUserInitials((first.charAt(0) + last.charAt(0)).toUpperCase());
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  // Fetch chat history when thread changes
  useEffect(() => {
    if (currentThread && (currentThread.id || currentThread.thread_id)) {
      const threadId = currentThread.id || currentThread.thread_id;
      fetchChatHistory(threadId);
    } else {
      setMessages([]);
    }
  }, [currentThread]);

  const fetchThreads = async () => {
    try {
      setIsLoadingThreads(true);
      setError(null);
      const response = await chatService.listThreads();
      console.log("List threads response:", response);

      const threadsList = response.threads || response.data || response || [];
      const threadsArray = Array.isArray(threadsList) ? threadsList : [];

      // Normalize thread IDs - ensure all threads have 'id' field
      const normalizedThreads = threadsArray.map(thread => {
        const normalized = { ...thread };
        if (normalized.thread_id && !normalized.id) {
          normalized.id = normalized.thread_id;
        }
        return normalized;
      });

      // Filter out system-generated threads (e.g. Diagnostic Results or Pathway sessions)
      const filteredThreads = normalizedThreads.filter(thread => {
        const title = thread.title || "";
        const isDiagnostic = title === "Leadership Diagnostic Results" || title === "Diagnostic Debrief";
        const isPathway = /^(GOAL|RES|ENG|SELF|BELONG|EMP)\s*[-—]\s*/i.test(title);
        return !isDiagnostic && !isPathway;
      });

      // Sort threads by updated_at or created_at descending (most recent first)
      filteredThreads.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0);
        const dateB = new Date(b.updated_at || b.created_at || 0);
        return dateB - dateA;
      });

      setThreads(filteredThreads);
    } catch (err) {
      console.error("Failed to fetch threads:", err);
      setError("Failed to load chat threads");
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const fetchChatHistory = async (threadId) => {
    // Validate threadId before making API call
    if (!threadId || threadId === 'undefined') {
      console.error("Invalid threadId provided to fetchChatHistory:", threadId);
      setMessages([]);
      return;
    }

    try {
      setError(null);
      const response = await chatService.getChatHistory(threadId);
      console.log("Chat history response:", response);

      const history = response.history || response.messages || response.data || [];

      // Ensure history is an array
      const historyArray = Array.isArray(history) ? history : [];

      // Transform history to match component format
      const transformedMessages = historyArray.map(msg => ({
        type: msg.role === "user" ? "user" : "ai",
        text: msg.content || msg.text || msg.message || "",
        isHistory: true,
        id: msg.id || Math.random().toString(36).substr(2, 9)
      }));

      setMessages(transformedMessages);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setError("Failed to load chat history");
      setMessages([]);
    }
  };

  const handleCreateNewThread = async (title) => {
    // If no title provided, it's just a local UI reset to "Draft" mode
    if (!title) {
      setCurrentThread(null);
      setMessages([]);
      setError(null);
      return null;
    }

    try {
      setError(null);
      const response = await chatService.createNewThread(false, title);

      // Log the response to debug
      console.log("Create thread response:", response);

      // Try different response structures
      let newThread = response.thread || response.data || response;

      // Validate that we have an ID
      if (!newThread.id && !newThread.thread_id) {
        console.error("Thread response missing ID:", newThread);
        throw new Error("Invalid thread response: missing ID");
      }

      // Normalize the ID field if needed
      if (newThread.thread_id && !newThread.id) {
        newThread.id = newThread.thread_id;
      }

      // Add new thread to list and set as current
      setThreads(prev => [newThread, ...prev]);
      setCurrentThread(newThread);
      setMessages([]);

      return newThread;
    } catch (err) {
      console.error("Failed to create thread:", err);
      setError("Failed to create new chat");
      throw err;
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      setError(null);

      // If no current thread, create one
      let threadToUse = currentThread;
      if (!threadToUse) {
        try {
          // Use first 50 chars of message as title
          const title = messageText.length > 50 ? messageText.substring(0, 50) + "..." : messageText;
          threadToUse = await handleCreateNewThread(title);
        } catch (createErr) {
          console.error("Failed to create thread for message:", createErr);
          setError("Failed to create chat thread. Please try again.");
          return; // Exit early if thread creation fails
        }
      }

      // Validate that we have a thread with an ID
      if (!threadToUse || !threadToUse.id) {
        console.error("Invalid thread object:", threadToUse);
        setError("Invalid chat thread. Please refresh and try again.");
        return;
      }

      // Add user message immediately
      const userMessage = { type: "user", text: messageText };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Send message to API
      const response = await chatService.sendMessage(threadToUse.id, messageText);
      console.log("SendMessage Response:", response);

      // Get the response content - try all possible fields
      const botResponseText = response.response || response.message || response.content ||
        response.reply || response.text ||
        (response.data && (response.data.content || response.data.response || response.data.message || response.data.text)) || "";

      if (botResponseText) {
        // Mark the NEW message as NOT history so it animates
        setMessages(prev => [...prev, {
          type: "ai",
          text: botResponseText,
          isHistory: false,
          id: Date.now()
        }]);
      } else {
        // Fallback: fetch history if we couldn't parse the response
        await fetchChatHistory(threadToUse.id);
      }

      // Manually update the thread's timestamp locally and move to top
      // This fixes the issue where the backend doesn't update 'updated_at' automatically
      setThreads(prevThreads => {
        const updatedThreads = prevThreads.map(t => {
          if (t.id === threadToUse.id) {
            // Update title to be the latest message text
            const newTitle = messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText;
            return {
              ...t,
              updated_at: new Date().toISOString(),
              title: newTitle
            };
          }
          return t;
        });

        // Re-sort to ensure this thread hits the top
        updatedThreads.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at || 0);
          const dateB = new Date(b.updated_at || b.created_at || 0);
          return dateB - dateA;
        });

        return updatedThreads;
      });
    } catch (err) {
      console.error("Failed to send message:", err);

      const errorMessage = err.message || "";
      if (errorMessage.includes("Session expired") || errorMessage.includes("Authentication failed")) {
        setError("Session expired. Please log in again to continue.");
      } else {
        setError("Failed to send message. Please try again.");
      }

      // Remove the user message if send failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectThread = (thread) => {
    if (!thread) {
      console.error("Invalid thread provided to handleSelectThread");
      return;
    }

    // Normalize the ID field if needed
    const normalizedThread = { ...thread };
    if (normalizedThread.thread_id && !normalizedThread.id) {
      normalizedThread.id = normalizedThread.thread_id;
    }

    // Validate thread has an ID
    if (!normalizedThread.id) {
      console.error("Thread missing ID:", thread);
      setError("Invalid thread selected");
      return;
    }

    console.log("Selecting thread:", normalizedThread);
    setCurrentThread(normalizedThread);
  };

  const handleResetChat = () => {
    setCurrentThread(null);
    setMessages([]);
  };

  const handleCloseThread = async (threadId) => {
    try {
      await chatService.closeThread(threadId);

      // Remove thread from list
      setThreads(prev => prev.filter(t => t.id !== threadId));

      // If current thread was closed, clear it
      if (currentThread?.id === threadId) {
        setCurrentThread(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to close thread:", err);
      setError("Failed to close chat");
    }
  };

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
      <NormalChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        threads={threads}
        currentThread={currentThread}
        onSelectThread={handleSelectThread}
        onResetChat={handleResetChat}
        onCreateNewThread={handleCreateNewThread}
        onCloseThread={handleCloseThread}
        isLoading={isLoadingThreads}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-[#ECECEC] relative h-full">
        <img
          src="/assets/images/dashboard/normaltop.webp"
          alt="dashboard top background"
          className="absolute top-0 left-0 w-[337px] z-0 h-[348px] object-cover object-top pointer-events-none"
        />
        <NormalChatHeader
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentThread={currentThread}
        />
        <div className="flex-1 overflow-hidden">
          <NormalChatContent
            messages={messages}
            isTyping={isTyping}
            error={error}
            userInitials={userInitials}
          />
        </div>
        <div className="flex-shrink-0">
          <NormalChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
        <img
          src="/assets/images/dashboard/normalbottom.webp"
          alt="dashboard bottom background"
          className="absolute bottom-0 right-0 w-[337px] z-0 h-[348px] object-cover object-bottom pointer-events-none"
        />
      </div>
    </div>
  );
};

export default NormalChatLayout;
