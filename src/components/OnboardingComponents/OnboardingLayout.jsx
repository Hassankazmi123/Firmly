import React from "react";

const OnboardingLayout = ({ children }) => {
  return (
     <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-start pb-12 border-[16px] border-[#6664d3]" style={{ backgroundColor: '#7472d6' }}>
      {/* Background image layered over the gradient but behind corners/content */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/images/onboarding/background_Onboarding.webp"
          alt="onboarding background"
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="absolute top-0 left-0 pointer-events-none z-10">
        <img
          src="/assets/images/onboarding/Top_Left_Corner.webp"
          alt="Top Left Corner"
          className="w-auto h-auto"
        />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none z-10">
        <img
          src="/assets/images/onboarding/Top_Right_Corner.webp"
          alt="Top Right Corner"
          className="w-auto h-auto"
        />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none z-10">
        <img
          src="/assets/images/onboarding/Bottom_Right_Corner.webp"
          alt="Bottom Right Corner"
          className="w-auto h-auto"
        />
      </div>
      <header className="w-full pt-8 flex justify-center z-20 relative">
        <div className="text-white font-semibold tracking-wide text-xl font-inter">firmly</div>
      </header>

      <main className="flex-1 w-full flex items-center justify-center px-6 z-20 relative">
        {children}
      </main>
    </div>
  );
};

export default OnboardingLayout;
