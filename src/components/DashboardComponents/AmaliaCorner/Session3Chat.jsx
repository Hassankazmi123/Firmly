import React, { useEffect, useRef, useState } from "react";
import ChatInputFooter from "./ChatInputFooter";
import { useNavigate } from "react-router-dom";
import { pathwayService } from "../../../services/pathway";

const Session3Chat = ({ isSidebarCollapsed = true }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    initializeSession();
  }, []);

  const processHistoryData = (historyData) => {
    let historyMessages = [];
    if (Array.isArray(historyData)) {
      historyMessages = historyData;
    } else if (historyData && Array.isArray(historyData.messages)) {
      historyMessages = historyData.messages;
    }

    if (historyMessages.length > 0) {
      return historyMessages.map((msg, idx) => ({
        id: msg.id || idx,
        type: (msg.sender && msg.sender.toLowerCase().trim() === 'user') ? 'user' : 'amalia',
        content: msg.text || msg.content
      }));
    }
    return [];
  };

  const getDomain = () => {
    const rawDomain = sessionStorage.getItem("currentPathwayDomain");
    if (!rawDomain || rawDomain === "null" || rawDomain === "undefined") return "emp";
    const d = rawDomain.toLowerCase();
    if (d.includes("resilience") || d.includes("resilien") || d.includes(" res")) return "res";
    if (d.includes("goal")) return "goal";
    if (d.includes("engagement") || d.includes("engage")) return "eng";
    if (d.includes("self")) return "self";
    if (d.includes("empathy") || d.includes("emp")) return "emp";
    return "emp";
  };

  const initializeSession = async () => {
    setLoading(true);
    const domain = getDomain();
    try {
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession3();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession3();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession3();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession3();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession3();
      }

      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      } else {
        await startSession();
      }
    } catch (error) {
      console.error(`Failed to initialize session 3 (${domain}):`, error);
      await startSession();
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    const domain = getDomain();
    try {
      let data;
      if (domain === "goal") {
        data = await pathwayService.startGoalSession3();
      } else if (domain === "res") {
        data = await pathwayService.startResilienceSession3();
      } else if (domain === "eng") {
        data = await pathwayService.startEngagementSession3();
      } else if (domain === "self") {
        data = await pathwayService.startSelfAwarenessSession3();
      } else {
        data = await pathwayService.startEmpathySession3();
      }

      if (data) {
        const content = data.message || data.text || data.response;
        if (content) {
          setMessages([{
            id: Date.now(),
            type: 'amalia',
            content: content
          }]);
        }
      }
    } catch (err) {
      console.error(`Error starting session 3 (${domain}):`, err);
    }
  };

  const handleSendMessage = async (text) => {
    const domain = getDomain();
    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      let domain = getDomain();

      // Keyword-based domain switching fallback
      const lowerText = text.toLowerCase();
      if (lowerText.includes("resilience") || lowerText.includes("resilien") || lowerText.includes(" res")) {
        domain = "res";
        sessionStorage.setItem("currentPathwayDomain", "res");
      } else if (lowerText.includes("goal")) {
        domain = "goal";
        sessionStorage.setItem("currentPathwayDomain", "goal");
      } else if (lowerText.includes("engagement") || lowerText.includes("engage")) {
        domain = "eng";
        sessionStorage.setItem("currentPathwayDomain", "eng");
      } else if (lowerText.includes("self") && lowerText.includes("awareness")) {
        domain = "self";
        sessionStorage.setItem("currentPathwayDomain", "self");
      }

      if (domain === "goal") {
        await pathwayService.sendGoalMessageSession3(text, "CORE");
      } else if (domain === "res") {
        await pathwayService.sendResilienceMessageSession3(text, "CORE");
      } else if (domain === "eng") {
        await pathwayService.sendEngagementMessageSession3(text, "CORE");
      } else if (domain === "self") {
        await pathwayService.sendSelfAwarenessMessageSession3(text, "CORE");
      } else {
        await pathwayService.sendEmpathyMessageSession3(text, "CORE");
      }

      // Fetch fresh history to get the bot response and sync state
      let historyData;
      if (domain === "goal") {
        historyData = await pathwayService.getGoalHistorySession3();
      } else if (domain === "res") {
        historyData = await pathwayService.getResilienceHistorySession3();
      } else if (domain === "eng") {
        historyData = await pathwayService.getEngagementHistorySession3();
      } else if (domain === "self") {
        historyData = await pathwayService.getSelfAwarenessHistorySession3();
      } else {
        historyData = await pathwayService.getEmpathyHistorySession3();
      }

      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    } catch (error) {
      console.error(`Failed to send message session 3 (${domain}):`, error);
    }
  };

  const handleNextSession = async () => {
    const domain = getDomain();
    try {
      if (domain === "goal") {
        await pathwayService.sendGoalMessageSession3("", "GOODBYE");
      } else if (domain === "res") {
        await pathwayService.sendResilienceMessageSession3("", "GOODBYE");
      } else if (domain === "eng") {
        await pathwayService.sendEngagementMessageSession3("", "GOODBYE");
      } else if (domain === "self") {
        await pathwayService.sendSelfAwarenessMessageSession3("", "GOODBYE");
      } else {
        await pathwayService.sendEmpathyMessageSession3("", "GOODBYE");
      }
    } catch (error) {
      console.error(`Error ending session 3 (${domain}):`, error);
    }

    sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
    sessionStorage.setItem("fromStartSession", "true");
    sessionStorage.setItem("fromSession3Next", "true");
    navigate("/dashboard");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto w-full px-4 pb-32 max-w-5xl mx-auto">
        {loading && messages.length === 0 && (
          <div className="p-4 text-center text-gray-500">Loading session...</div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-6 flex w-full ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-4 rounded-xl max-w-[85%] ${message.type === "amalia"
                ? "bg-[#F5F5FF]"
                : "bg-[#f5f5f5] ml-auto"
                }`}
            >
              <p className="text-sm md:text-base text-black font-inter leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        <div className="flex lg:flex-row flex-col gap-4 lg:max-w-sm lg:mx-auto mt-8 mb-4">
          <button
            onClick={handleNextSession}
            className="flex-1 px-5  py-3.5  bg-[#F5F5F5] lg:max-w-fit text-[#578DDD] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#E5E5E5]"
          >
            Next Session
          </button>
          <button
            onClick={handleGoToDashboard}
            className="flex-1   py-3.5 px-5  bg-[#3D3D3D] lg:max-w-fit text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
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

export default Session3Chat;
