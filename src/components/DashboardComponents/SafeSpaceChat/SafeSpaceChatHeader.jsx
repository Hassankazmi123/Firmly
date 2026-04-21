import React from "react";

const SafeSpaceChatHeader = ({ onMenuClick, hasMessages = false }) => {
  return (
    <div className="p-4 md:p-6 ">
      <h1 className="text-xl md:text-2xl font-semibold text-black font-cormorant">
        {hasMessages ? "Safe Space (Incognito mode)" : "Amalia"}
      </h1>
      <p className="text-sm text-[#3D3D3D]/60 font-inter font-medium max-w-md">
        {hasMessages
          ? "Incognito mode for sensitive topics."
          : ""}
      </p>
    </div>
  );
};

export default SafeSpaceChatHeader;
