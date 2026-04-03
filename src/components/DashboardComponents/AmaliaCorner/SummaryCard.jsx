import React from "react";
const SummaryCard = ({ title, subtitle, items, bgColor, iconImage }) => {
  return (
    <div className={`${bgColor} rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default`}>
      {iconImage && (
        <img
          src={iconImage}
          alt={title}
          className=" top-2 left-4    2xl:w-28 2xl:h-28 xl:w-24 xl:h-24 lg:w-20 lg:h-20 w-16 h-16"
        />
      )}
      <div className="relative z-10 mt-4">
        <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-white mb-2 font-cormorant">
          {title}
        </h3>
        <p className="text-xs text-[#FFFFFF]/70 mb-4 md:mb-6 font-inter-medium">
          {subtitle}
        </p>
        <div className="space-y-3 md:space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-[#FFFFFF]/10 pb-4"
            >
              <span className="text-xs md:text-sm font-inter-medium text-[#F5F5F5] bg-[#F5F5F5]/10 px-2 md:px-3 py-1 rounded-lg border-[1px] border-[#FFFFFF]">
                {item.abbreviation}
              </span>
              <span className="text-sm md:text-lg text-white flex-1 font-cormorant">
                {item.label}
              </span>
              <span className="text-lg md:text-xl lg:text-2xl  text-white font-cormorant">
                {item.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SummaryCard;