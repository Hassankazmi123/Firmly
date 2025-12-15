import React, { useState } from "react";

const SafeSpaceChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="bg-white pb-4 md:pb-6 lg:px-0 px-4  flex-shrink-0 max-w-4xl mx-auto">
      <div className="flex flex-row gap-2 md:gap-4 items-center w-full">
        <input
          type="text"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-2 md:px-4 py-2 md:py-3 bg-[#F5F5F5] text-[#9E9CAE] lg:rounded-xl rounded-md border border-[#ECECEC] focus:outline-none focus:ring-[1px] focus:[#6664D3] font-inter text-xs md:text-base"
        />
        <div className="flex gap-2 md:gap-3 shrink-0">
          <button
            className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#6664D3] text-white flex items-center justify-center transition-colors shrink-0 hover:bg-[#5a58c0]"
            aria-label="Voice input"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <button
            onClick={handleSend}
            className="px-2 lg:text-md text-xs md:px-6 py-1.5 md:py-3 bg-[#3D3D3D] text-[#F5F5F5] lg:rounded-xl rounded-md font-medium transition-colors  md:text-base shrink-0 hover:bg-[#2D2D2D] font-inter"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafeSpaceChatInput;
