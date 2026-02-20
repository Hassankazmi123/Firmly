import React, { useState } from "react";
import CreateAccountModal from "./CreateAccountModal";

const Screen3Card = ({ onPrevious, onNext, onLogin }) => {
  const [showCreateAccount, setShowCreateAccount] = useState(() => {
    return (
      localStorage.getItem("onboardingShowCreateAccount") === "true" ||
      localStorage.getItem("onboardingShowCompleteProfile") === "true" ||
      localStorage.getItem("onboardingShowAccountCreated") === "true"
    );
  });

  const handleExistingAccount = () => {
    if (typeof onLogin === "function") {
      onLogin();
      return;
    }

    if (typeof onPrevious === "function") {
      onPrevious();
    }
  };

  const handleCreateAccount = () => {
    setShowCreateAccount(true);
    localStorage.setItem("onboardingShowCreateAccount", "true");
  };

  // Show create account modal if requested
  if (showCreateAccount) {
    return (
      <CreateAccountModal
        isOpen={true}
        onClose={() => {
          setShowCreateAccount(false);
          localStorage.removeItem("onboardingShowCreateAccount");
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center drop-shadow-lg max-w-2xl w-full">
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm">
            <img
              src="/assets/images/onboarding/Screen3_Pic.webp"
              alt="Quick Chat with Amalia"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
          <div className="w-full px-2">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 font-cormorant leading-tight">
              Quick 1:1 Chat with Amalia™
            </h1>
            <p className="text-white/90 text-sm sm:text-base w-full font-inter leading-relaxed">
              Amalia supports you with guided conversations that fit your needs.
              Switch seamlessly between Normal Chat for coaching or Safe Space
              (Incognito Mode) when you're ready to open up and reflect.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-2 mt-2 sm:mt-4">
            <button
              onClick={handleExistingAccount}
              className="w-full sm:flex-1 px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent border border-white/30 text-white font-medium rounded-2xl hover:bg-white/10 active:scale-95 transition-all font-inter text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              I already have an Account
            </button>
            <button
              onClick={handleCreateAccount}
              className="w-full sm:flex-1 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#6b4bff] font-medium rounded-2xl shadow-sm hover:bg-white/90 active:scale-95 transition-all font-inter text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen3Card;
