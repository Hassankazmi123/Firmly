import React from "react";

const PathwayCard = ({ onPrevious, onNext }) => {
  return (
    <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center drop-shadow-lg max-w-2xl w-full">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm">
            <img
              src="/assets/images/onboarding/Screen2_Pic.webp"
              alt="Pathway Overview"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
          <div className="w-full px-2">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 font-cormorant leading-tight">
              Get Your Personalized Pathway
            </h1>
            <p className="text-white/90 text-sm sm:text-base w-full font-inter leading-relaxed">
              Amalia creates a tailored leadership journey just for you—complete
              with reading assignments, conversation tactics, skill-building
              exercises, and voice coaching sessions.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2 sm:mt-4">
            <button
              onClick={onPrevious}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 active:scale-95 transition-all font-inter text-sm min-h-[44px]"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-white text-[#6b4bff] font-medium rounded-full shadow-sm hover:bg-white/90 active:scale-95 transition-all font-inter text-sm min-h-[44px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayCard;
