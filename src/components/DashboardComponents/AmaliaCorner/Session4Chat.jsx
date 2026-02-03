import React, { useState, useEffect, useRef } from "react";
import ChatInputFooter from "./ChatInputFooter";
import SessionFeedbackModal from "../AllModals/SessionFeedbackModal";
import { pathwayService } from "../../../services/pathway";

const Session4Chat = ({ isSidebarCollapsed = true }) => {
  const [messages, setMessages] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
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
      const historyData = await pathwayService.getEmpathyHistorySession4();
      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      } else {
        await startSession();
      }
    } catch (error) {
      console.error("Failed to initialize session 4:", error);
      await startSession();
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const data = await pathwayService.startEmpathySession4();
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
      console.error("Error starting session 4:", err);
    }
  };

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      await pathwayService.sendEmpathyMessageSession4(text, "CORE");

      // Fetch fresh history to get the bot response and sync state
      const historyData = await pathwayService.getEmpathyHistorySession4();
      const formatted = processHistoryData(historyData);

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    } catch (error) {
      console.error("Failed to send message session 4:", error);
    }
  };

  const handleShareFeedback = async () => {
    try {
      // Properly end the session before showing feedback modal
      await pathwayService.sendEmpathyMessageSession4("", "GOODBYE");
    } catch (error) {
      console.error("Error ending session 4 for feedback:", error);
    }
    setIsFeedbackModalOpen(true);
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
          </div>
        ))}
        <div ref={messagesEndRef} />

        <div className="flex lg:flex-row flex-col gap-4 max-w-fit mx-auto mt-8 mb-4">
          <button
            onClick={handleShareFeedback}
            className="flex-1 py-3.5 px-5 bg-[#3D3D3D] text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
          >
            Share Feedback
          </button>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 ${isSidebarCollapsed ? "z-50" : ""
          } md:z-50`}
      >
        <ChatInputFooter onSend={handleSendMessage} />
      </div>
      <SessionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
};

export default Session4Chat;
