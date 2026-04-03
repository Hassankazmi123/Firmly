import React from "react";
const ChatHeader = ({ onMenuClick, title }) => {
  return (
    <div className="p-4  flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-600 hover:text-gray-900 transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-xl md:text-2xl font-semibold text-black font-cormorant">
        {title || "In Conversation with Amalia"}
      </h1>
    </div>
  );
};
export default ChatHeader;