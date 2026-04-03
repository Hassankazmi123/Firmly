import React, { useState, useEffect } from "react";

const ChatMessage = ({ message, userInitials, alignUserLeft = false, disableAnimation = false }) => {
  const isMessageObject = typeof message === "object" && message !== null;
  const isReactElement = isMessageObject && message.$$typeof;

  const type = isMessageObject && !isReactElement ? message.type || "amalia" : "amalia";
  const content = isMessageObject && !isReactElement ? message.content || message.text : message;

  const isUser = type === "user";
  const [displayedContent, setDisplayedContent] = useState(isUser || disableAnimation ? content : "");

  useEffect(() => {
    if (!isUser && !disableAnimation && content) {
      if (typeof content !== "string") {
        setDisplayedContent(content);
        return;
      }
      let index = 0;
      const timer = setInterval(() => {
        setDisplayedContent((prev) => content.slice(0, index + 1));
        index++;
        if (index >= content.length) {
          clearInterval(timer);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [content, isUser, disableAnimation]);
  const isAmaliaString = !isUser && typeof content === "string";

  return (
    <div className="mb-6 flex w-full flex-col relative animate-fadeInUp">
      <div
        className={`flex w-full items-start gap-3 ${
          isUser && !alignUserLeft ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <div className="flex-shrink-0 mt-1">
            <img
              src="/assets/images/dashboard/starwhite.webp"
              alt="Amalia"
              className="w-10 h-10 rounded-full bg-[#8A88F3] p-2 object-contain"
            />
          </div>
        )}

        {isUser && alignUserLeft && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#3D3D3D] font-inter-semibold text-sm uppercase">
              {userInitials || "YO"}
            </div>
          </div>
        )}

        <div
          className={`rounded-2xl p-4 max-w-[85%] ${
            isUser
              ? "bg-[#F5F5F5] text-[#3D3D3D] rounded-tr-none"
              : "bg-[#F5F5FF] text-black rounded-tl-none"
          }`}
        >
          <div className="text-sm md:text-base font-inter leading-relaxed whitespace-pre-wrap">
            {displayedContent}
          </div>
        </div>

        {isUser && !alignUserLeft && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#3D3D3D] font-inter-semibold text-sm uppercase">
              {userInitials || "YO"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;