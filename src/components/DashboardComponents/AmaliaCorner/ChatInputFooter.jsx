import React, { useState } from "react";
const ChatInputFooter = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState("");
  const handleSend = () => {
    if (message.trim() && !disabled) {
      if (onSend) {
        onSend(message);
      }
      setMessage("");
    }
  };
  return (
    <div className=" bg-white p-4 max-w-5xl mx-auto ">
      <div className="flex flex-row gap-2 md:gap-4 items-center">
        <input
          type="text"
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
          className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-[#F5F5F5] text-black rounded-xl border border-[#ECECEC] focus:outline-none  focus:ring-[1px] focus:[#6664D3] font-inter-medium text-xs md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex gap-2 md:gap-3 shrink-0">

          <button
            onClick={handleSend}
            disabled={disabled}
            className="px-3 md:px-6 py-2 md:py-3 bg-[#3D3D3D] text-[#F5F5F5] rounded-xl font-medium transition-colors text-xs md:text-base shrink-0 hover:bg-[#2D2D2D] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatInputFooter;
