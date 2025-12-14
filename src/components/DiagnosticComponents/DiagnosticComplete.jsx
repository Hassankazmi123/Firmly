import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../DashboardComponents/notification/Notification";

const DiagnosticComplete = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="bg-[#ababab] 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 py-1.5 px-4 sticky top-0 z-50">
        <div className="relative z-20 flex items-center justify-between h-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            type="button"
            aria-label="Go to Dashboard"
          >
            <img
              src="/assets/images/dashboard/logowhite.webp"
              alt="firmly logo"
              className="h-7 w-auto"
            />
          </button>
          <div className="flex items-center sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-white">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/images/dashboard/starwhite.webp"
                  alt="user icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
                <span className="text-white/70 text-sm sm:text-base">
                  Amalia
                </span>
                <span className="text-sm flex items-center justify-center bg-[#ababab] border border-white/20 text-white/70 px-2 py-0.5 rounded-full">
                  • online
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                className="relative text-white p-2 rounded-lg transition-colors"
                onClick={() => setIsNotificationOpen((s) => !s)}
                aria-expanded={isNotificationOpen}
                aria-label="Toggle notifications"
                type="button"
              >
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-2 h-2.5 w-2.5 bg-[#D46FA8] rounded-full" />
              </button>
            </div>
          </div>
        </div>
        <NotificationPopup
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </header>

      <div className="flex-1 flex items-center justify-center border-[8px] sm:border-[12px] md:border-[16px] border-[#f5f5f5] relative overflow-hidden bg-[#ebebeb] rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/images/onboarding/Diagnostic_bg.webp"
            alt="onboarding background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute top-0 left-0 pointer-events-none hidden md:block">
          <img
            src="/assets/images/onboarding/topleft-diag.webp"
            alt="top left"
            className="w-50 h-50 "
          />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none hidden md:block">
          <img
            src="/assets/images/onboarding/Diagnostic_Topright.webp"
            alt="top right"
            className="w-50 h-50 "
          />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none hidden md:block">
          <img
            src="/assets/images/onboarding/Diagnostic_Bottomright.webp"
            alt="bottom right"
            className="w-50 h-60"
          />
        </div>
        {/* Make inner content full-width so left and right sections hug the edges */}
        <div className="w-full relative z-10 px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 pt-4 sm:pt-6 lg:pt-0">
              <div className="mb-4 sm:mb-6 lg:-mt-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 md:border-3 lg:border-4 border-white flex items-center justify-center shadow-lg">
                  <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 font-inter">
                    100%
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-cormorant">
                Firmly Diagnostic
              </h1>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-inter max-w-3xl">
                Excellent work! Your diagnostic assessment is now complete.
                <br className="hidden sm:block" />
                We will now share your self-reported scores across six key
                metrics that influence workplace wellbeing and leadership
                development. These insights will form the foundation of your
                personalized coaching plan with Amalia.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md w-full lg:w-auto max-w-[500px] mx-auto lg:mx-0 relative pt-10 sm:pt-12 mb-6 sm:mb-8 lg:mb-0">
              <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-[#d46fa8]">
                <img
                  src="/assets/images/onboarding/DiagLeft.webp"
                  alt="card top decoration"
                  className="w-full h-10 sm:h-12 object-cover"
                />
              </div>
              <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-800 mb-2 font-cormorant">
                You're set to a great start!
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 font-inter leading-relaxed">
                Remember, these scores aren't meant to discourage you — they're
                here to set a benchmark for your growth and celebrate the
                capabilities you already have.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#222] text-white rounded-full text-xs sm:text-sm font-medium hover:bg-[#333] active:scale-95 transition-all min-h-[44px]"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticComplete;
