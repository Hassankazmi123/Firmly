import React, { useEffect, useRef, useState } from "react";
import ChatInputFooter from "./ChatInputFooter";
import { useNavigate } from "react-router-dom";
import { pathwayService } from "../../../services/pathway";

const Session1Chat = ({ isSidebarCollapsed = true }) => {
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
        type: msg.sender === 'user' ? 'user' : 'amalia',
        content: msg.text || msg.content
      }));
    }
    return [];
  };

  const initializeSession = async () => {
    setLoading(true);
    try {
      const historyData = await pathwayService.getEmpathyHistory();
      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      } else {
        await startSession();
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      await startSession();
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const data = await pathwayService.startEmpathySession1();
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
      console.error("Error starting session:", err);
    }
  };

  const handleSendMessage = async (text) => {
    // Optimistic UI update
    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      await pathwayService.sendEmpathyMessage(text, "CORE");

      // Fetch fresh history to get the bot response and sync state
      // This solves the issue where response wasn't showing until refresh
      const historyData = await pathwayService.getEmpathyHistory();
      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleNextSession = async () => {
    try {
      // End session
      await pathwayService.sendEmpathyMessage("", "GOODBYE");
    } catch (error) {
      console.error("Error ending session:", error);
    }

    sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
    sessionStorage.setItem("fromStartSession", "true");
    sessionStorage.setItem("fromNextSession", "true");
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
          <div key={message.id} className="mb-6">
            {message.type === "amalia" ? (
              <div className="bg-[#F5F5FF] rounded-lg p-4">
                <p className="text-sm md:text-base text-black font-inter leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="bg-[#f5f5f5] rounded-lg p-4 ml-auto max-w-fit">
                <p className="text-sm md:text-base text-black font-inter leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            )}

            {/* 
              Simplified response logic: removed the complex specific 'showResponse' Logic 
              from the static mock data as dynamic data won't have it unless backend provides.
              Assuming linear chat flow.
            */}
          </div>
        ))}
        <div ref={messagesEndRef} />

        <div className="flex lg:flex-row flex-col gap-4 lg:max-w-sm lg:mx-auto mt-8 mb-4">
          <button
            onClick={handleNextSession}
            className="flex-1 px-5  py-3.5 lg:max-w-fit  bg-[#F5F5F5]  text-[#578DDD] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#E5E5E5]"
          >
            Next Session
          </button>
          <button
            onClick={handleGoToDashboard}
            className="flex-1   py-3.5 px-5 lg:max-w-fit  bg-[#3D3D3D] text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
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

export default Session1Chat;
