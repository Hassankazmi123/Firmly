import React, { useState, useEffect, useRef, useCallback } from "react";
import ChatInputFooter from "./ChatInputFooter";
import SessionFeedbackModal from "../AllModals/SessionFeedbackModal";
import { pathwayService } from "../../../services/pathway";
import ChatMessage from "./ChatMessage";

const Session4Chat = ({ isSidebarCollapsed = true, onComplete, userInitials }) => {
  const [messages, setMessages] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const processHistoryData = useCallback((historyData) => {
    let historyMessages = [];
    if (Array.isArray(historyData)) {
      historyMessages = historyData;
    } else if (historyData && Array.isArray(historyData.messages)) {
      historyMessages = historyData.messages;
    }

    if (historyMessages.length > 0) {
      return historyMessages.map((msg, idx) => ({
        id: msg.id || idx,
        type:
          (msg.role === "user" || (msg.sender && ["user", "human"].includes(msg.sender.toLowerCase().trim())))
            ? "user"
            : "amalia",
        content: msg.text || msg.content,
      }));
    }
    return [];
  }, []);

  const startSession = useCallback(async () => {
    const domain = getDomain();
    try {
      let data;
      if (domain === "goal") {
        data = await pathwayService.startGoalSession4();
      } else if (domain === "res") {
        data = await pathwayService.startResilienceSession4();
      } else if (domain === "eng") {
        data = await pathwayService.startEngagementSession4();
      } else if (domain === "self") {
        data = await pathwayService.startSelfAwarenessSession4();
      } else if (domain === "belong") {
        data = await pathwayService.startBelongingSession4();
      } else {
        data = await pathwayService.startEmpathySession4();
      }

      // First try to use the message directly from the start response
      if (data) {
        const content = data.message || data.text || data.response;
        if (content) {
          setMessages([
            {
              id: Date.now(),
              type: "amalia",
              content: content,
            },
          ]);
          return; // Message set successfully, no need to fetch history
        }
      }

      // Fallback: fetch history to get the initial message
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession4();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession4();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession4();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession4();
      } else if (domain === "belong") {
        historyData = await pathwayService.getBelongingHistorySession4();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession4();
      }
      const historyMessages = Array.isArray(historyData)
        ? historyData
        : historyData?.messages || [];
      if (historyMessages.length > 0) {
        setMessages(historyMessages.map((msg, idx) => ({
          id: msg.id || idx,
          type: (msg.role === "user" || (msg.sender && ["user", "human"].includes(msg.sender.toLowerCase().trim()))) ? "user" : "amalia",
          content: msg.text || msg.content,
        })));
      }
    } catch (err) {
      console.error(`Error starting session 4 (${getDomain()}):`, err);
    }
  }, [getDomain]);

  const initializeSession = useCallback(async () => {
    setLoading(true);
    const domain = getDomain();
    try {
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession4();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession4();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession4();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession4();
      } else if (domain === "belong") {
        historyData = await pathwayService.getBelongingHistorySession4();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession4();
      }

      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      } else {
        await startSession();
      }
    } catch (error) {
      console.error(`Failed to initialize session 4 (${domain}):`, error);
      await startSession();
    } finally {
      setLoading(false);
    }
  }, [getDomain, processHistoryData, startSession]);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleSendMessage = async (text) => {
    const domain = getDomain();
    const userMsg = { id: Date.now(), type: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setIsTyping(true);
      let domain = getDomain();
      // ... (rest of sending logic) ...
      if (domain === "goal") {
        await pathwayService.sendGoalMessageSession4(text, "CORE");
      } else if (domain === "res") {
        await pathwayService.sendResilienceMessageSession4(text, "CORE");
      } else if (domain === "eng") {
        await pathwayService.sendEngagementMessageSession4(text, "CORE");
      } else if (domain === "self") {
        await pathwayService.sendSelfAwarenessMessageSession4(text, "CORE");
      } else if (domain === "belong") {
        await pathwayService.sendBelongingMessageSession4(text, "CORE");
      } else {
        await pathwayService.sendEmpathyMessageSession4(text, "CORE");
      }

      // Fetch fresh history to get the bot response and sync state
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession4();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession4();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession4();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession4();
      } else if (domain === "belong") {
        historyData = await pathwayService.getBelongingHistorySession4();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession4();
      }

      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    } catch (error) {
      console.error(`Failed to send message session 4 (${domain}):`, error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShareFeedback = async () => {
    const domain = getDomain();
    try {
      // Properly end the session before showing feedback modal
      if (domain === "goal") {
        await pathwayService.sendGoalMessageSession4("", "GOODBYE");
      } else if (domain === "res") {
        await pathwayService.sendResilienceMessageSession4("", "GOODBYE");
      } else if (domain === "eng") {
        await pathwayService.sendEngagementMessageSession4("", "GOODBYE");
      } else if (domain === "self") {
        await pathwayService.sendSelfAwarenessMessageSession4("", "GOODBYE");
      } else if (domain === "belong") {
        await pathwayService.sendBelongingMessageSession4("", "GOODBYE");
      } else {
        await pathwayService.sendEmpathyMessageSession4("", "GOODBYE");
      }
    } catch (error) {
      console.error(`Error ending session 4 (${domain}) for feedback:`, error);
    }
    setIsFeedbackModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto w-full px-4 pb-32 max-w-5xl mx-auto">
        {loading && messages.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Loading session...
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            userInitials={userInitials} 
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
            onClick={handleShareFeedback}
            className="flex-1 py-3.5 px-5 bg-[#3D3D3D] text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
          >
            Share Feedback
          </button>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 ${
          isSidebarCollapsed ? "z-50" : ""
        } md:z-50`}
      >
        <ChatInputFooter onSend={handleSendMessage} />
      </div>
      <SessionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onContinue={onComplete}
      />
    </div>
  );
};

export default Session4Chat;
