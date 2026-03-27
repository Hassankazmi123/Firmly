import React, { useEffect, useRef, useState, useCallback } from "react";
import ChatInputFooter from "./ChatInputFooter";
import { useNavigate } from "react-router-dom";
import { pathwayService } from "../../../services/pathway";
import ChatMessage from "./ChatMessage";

const Session2Chat = ({ isSidebarCollapsed = true, onNextSession, userInitials }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionPhase, setSessionPhase] = useState("");

  const getDomain = useCallback(() => {
    const rawDomain = sessionStorage.getItem("currentPathwayDomain");
    if (!rawDomain || rawDomain === "null" || rawDomain === "undefined")
      return "emp";
    const d = rawDomain.toLowerCase();
    if (
      d.includes("resilience") ||
      d.includes("resilien") ||
      d.includes(" res")
    )
      return "res";
    if (d.includes("goal")) return "goal";
    if (d.includes("engagement") || d.includes("engage")) return "eng";
    if (d.includes("self")) return "self";
    if (d.includes("belonging") || d.includes("belong")) return "belong";
    if (d.includes("empathy") || d.includes("emp")) return "emp";
    return "emp";
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkHistoryStatus = useCallback((historyData) => {
    if (historyData?.status === "COMPLETED") {
      setSessionPhase("GOODBYE");
    }
  }, []);

  const processHistoryData = useCallback((historyData, forceHistory = true) => {
    let historyMessages = [];
    if (Array.isArray(historyData)) {
      historyMessages = historyData;
    } else if (historyData && Array.isArray(historyData.messages)) {
      historyMessages = historyData.messages;
    }

    if (historyMessages.length > 0) {
      const filtered = historyMessages.filter((msg) => {
        const c = (msg.text || msg.content || "").trim().toLowerCase();
        return c !== "hello" && c !== "";
      });

      return filtered.map((msg, idx) => ({
        id: msg.id || idx,
        type: (msg.role === "user" || (msg.sender && ["user", "human"].includes(msg.sender.toLowerCase().trim()))) ? "user" : "amalia",
        content: msg.text || msg.content,
        isHistory: forceHistory || (idx < filtered.length - 1)
      }));
    }
    return [];
  }, []);

  const startSession = useCallback(async () => {
    const domain = getDomain();
    try {
      let data;
      if (domain === "goal") {
        data = await pathwayService.startGoalSession2();
      } else if (domain === "res") {
        data = await pathwayService.startResilienceSession2();
      } else if (domain === "eng") {
        data = await pathwayService.startEngagementSession2();
      } else if (domain === "self") {
        data = await pathwayService.startSelfAwarenessSession2();
      } else if (domain === "belong") {
        data = await pathwayService.startBelongingSession2();
      } else {
        data = await pathwayService.startEmpathySession2();
      }

      // First try to use the message directly from the start response
      if (data) {
        const content = data.message || data.text || data.response;
        if (content) {
          setMessages([{
            id: Date.now(),
            type: 'amalia',
            content: content
          }]);
          return; // Message set successfully, no need to fetch history
        }
      }

      // Fallback: fetch history to get the initial message
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession2();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession2();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession2();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession2();
      } else if (domain === "belong") {
        historyData = await pathwayService.getBelongingHistorySession2();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession2();
      }
      const historyMessages = Array.isArray(historyData)
        ? historyData
        : historyData?.messages || [];
      const filtered = historyMessages.filter((msg) => {
        const c = (msg.text || msg.content || "").trim().toLowerCase();
        return c !== "hello" && c !== "";
      });
      if (filtered.length > 0) {
        setMessages(filtered.map((msg, idx) => ({
          id: msg.id || idx,
          type: (msg.role === "user" || (msg.sender && ["user", "human"].includes(msg.sender.toLowerCase().trim()))) ? "user" : "amalia",
          content: msg.text || msg.content,
          isHistory: true,
        })));
      }
    } catch (err) {
      console.error(`Error starting session 2 (${domain}):`, err);
    }
  }, [getDomain]);

  const initializeSession = useCallback(async () => {
    setLoading(true);
    const domain = getDomain();
    try {
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession2();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession2();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession2();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession2();
      } else if (domain === "belong") {
        historyData = await pathwayService.getBelongingHistorySession2();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession2();
      }

      // Unlock Next Session button if session already completed
      checkHistoryStatus(historyData);

      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      } else {
        await startSession();
      }
    } catch (error) {
      console.error(`Failed to initialize session 2 (${domain}):`, error);
      await startSession();
    } finally {
      setLoading(false);
    }
  }, [getDomain, processHistoryData, startSession, checkHistoryStatus]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleSendMessage = async (text) => {
    const domain = getDomain();
    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setIsTyping(true);
      let currentDomain = getDomain();
      // ... (rest of sending logic) ...
      let sendResponse;
      if (currentDomain === "goal") {
        sendResponse = await pathwayService.sendGoalMessageSession2(text, "CORE");
      } else if (currentDomain === "res") {
        sendResponse = await pathwayService.sendResilienceMessageSession2(text, "CORE");
      } else if (currentDomain === "eng") {
        sendResponse = await pathwayService.sendEngagementMessageSession2(text, "CORE");
      } else if (currentDomain === "self") {
        sendResponse = await pathwayService.sendSelfAwarenessMessageSession2(text, "CORE");
      } else if (currentDomain === "belong") {
        sendResponse = await pathwayService.sendBelongingMessageSession2(text, "CORE");
      } else {
        sendResponse = await pathwayService.sendEmpathyMessageSession2(text, "CORE");
      }

      // Track phase from the send response
      if (sendResponse?.phase) {
        setSessionPhase(sendResponse.phase);
      }

      // Fetch fresh history to get the bot response and sync state
      let historyData;
      if (currentDomain === "goal") {
        historyData = await pathwayService.getGoalHistorySession2();
      } else if (currentDomain === "res") {
        historyData = await pathwayService.getResilienceHistorySession2();
      } else if (currentDomain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession2();
      } else if (currentDomain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession2();
      } else if (currentDomain === "belong") {
        historyData = await pathwayService.getBelongingHistorySession2();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession2();
      }

      // Unlock Next Session button if session completed
      checkHistoryStatus(historyData);

      const formatted = processHistoryData(historyData, false);

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    } catch (error) {
      console.error(`Failed to send message session 2 (${domain}):`, error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNextSession = async () => {
    const domain = getDomain();
    try {
      if (domain === "goal") {
        await pathwayService.sendGoalMessageSession2("", "GOODBYE");
      } else if (domain === "res") {
        await pathwayService.sendResilienceMessageSession2("", "GOODBYE");
      } else if (domain === "eng") {
        await pathwayService.sendEngagementMessageSession2("", "GOODBYE");
      } else if (domain === "self") {
        await pathwayService.sendSelfAwarenessMessageSession2("", "GOODBYE");
      } else if (domain === "belong") {
        await pathwayService.sendBelongingMessageSession2("", "GOODBYE");
      } else {
        await pathwayService.sendEmpathyMessageSession2("", "GOODBYE");
      }
    } catch (error) {
      console.error(`Error ending session 2 (${domain}):`, error);
    }

    if (onNextSession) {
      onNextSession();
    } else {
      sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
      sessionStorage.setItem("fromStartSession", "true");
      sessionStorage.setItem("fromSession2Next", "true");
      navigate("/dashboard");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto w-full px-4 pb-32 max-w-5xl mx-auto">
        {loading && messages.length === 0 && (
          <div className="p-4 text-center text-gray-500 font-inter">Loading session...</div>
        )}

        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            userInitials={userInitials} 
            disableAnimation={message.isHistory}
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 px-4 mb-6">
            <img
              src="/assets/images/dashboard/normalstar.webp"
              alt="Typing indicator"
              className="w-5 h-5 animate-spin"
            />
            <div className="flex gap-1">
              {[0, 150, 300, 450, 600].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-[#8A88F3] rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                ></div>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

        <div className="flex lg:flex-row flex-col gap-4 lg:max-w-sm lg:mx-auto mt-8 mb-4">
          <button
            onClick={sessionPhase === "GOODBYE" ? handleNextSession : undefined}
            className={`flex-1 px-5 py-3.5 lg:max-w-fit bg-[#F5F5F5] text-[#578DDD] rounded-2xl font-medium transition-all text-sm md:text-base ${
              sessionPhase === "GOODBYE"
                ? "opacity-100 cursor-pointer hover:bg-[#E5E5E5]"
                : "opacity-30 cursor-not-allowed pointer-events-none"
            }`}
          >
            Next Session
          </button>
          <button
            onClick={handleGoToDashboard}
            className="flex-1 py-3.5 px-5 lg:max-w-fit bg-[#3D3D3D] text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 ${isSidebarCollapsed ? "z-50" : ""
          } md:z-50`}
      >
        <ChatInputFooter onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default Session2Chat;
