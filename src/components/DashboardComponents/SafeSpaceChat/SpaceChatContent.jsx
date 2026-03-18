import ChatMessage from "../AmaliaCorner/ChatMessage";

const SpaceChatContent = ({
  messages = [],
  isTyping = false,
  userInitials = "",
}) => {
  const suggestedTopics = Array(7).fill("sensitive topics");
  if (messages.length > 0) {
    return (
      <div className="h-full px-4 py-6 relative overflow-y-auto chat-container-scroll">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={{
                type: message.type === "ai" ? "amalia" : "user",
                content: typeof message === "string" ? message : message.text,
              }}
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
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex items-center justify-center 2xl:pt-0 xl:pt-20 lg:pt-14 px-4 relative overflow-y-auto">
      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/assets/images/dashboard/emoji.webp"
            alt="Normal Chat"
            className="lg:w-24 lg:h-24 h-14 w-14  object-contain"
          />
        </div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-cormorant font-bold text-black mb-4">
          Safe Space (Incognito mode){" "}
        </h2>
        <p className="text-sm md:text-base text-[#3D3D3D]/60 font-inter font-medium mb-4 max-w-md mx-auto">
          Incognito mode for sensitive topics. A darker theme with clear privacy
          indicators.
        </p>
        <div className="mb-4">
          <button className="text-[#6664D3]  font-inter text-sm md:text-base transition-colors ">
            Ask about
          </button>
        </div>
        <div className="flex flex-col gap-2 md:gap-3 max-w-2xl mx-auto pb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {suggestedTopics.slice(0, 4).map((topic, index) => (
              <button
                key={index}
                className="px-3 lg:text-md text-xs md:px-4.5 py-2 md:py-3.5 bg-[#f5f5f5] text-[#3D3D3D]/60 lg:rounded-xl rounded-md font-inter font-medium  transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 md:justify-center md:mx-auto md:w-fit">
            {suggestedTopics.slice(4, 7).map((topic, index) => (
              <button
                key={index + 4}
                className="px-3 lg:text-md text-xs md:px-4.5 py-2 md:py-3.5 bg-[#f5f5f5] text-[#3D3D3D]/60 lg:rounded-xl rounded-md font-inter font-medium  transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceChatContent;
