import React from "react";

const ChatMessage = ({ message }) => {
  const isMessageObject = typeof message === "object" && message !== null;
  const isReactElement = isMessageObject && message.$$typeof; // Simple check for React element

  // If it's a React element or and object with type 'amalia', it's Amalia
  // Otherwise if it's an object with type 'user', it's the user
  const type = (isMessageObject && !isReactElement) ? (message.type || 'amalia') : 'amalia';
  const content = (isMessageObject && !isReactElement) ? (message.content || message.text) : message;

  const isUser = type === "user";

  return (
    <div className={`mb-6 flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`rounded-xl p-4 max-w-[85%] ${isUser ? "bg-[#f5f5f5] ml-auto" : "bg-[#F5F5FF]"}`}>
        <div className="text-sm md:text-base text-black font-inter leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;