import React, { useState } from "react";
import CreateAccountModal from "./CreateAccountModal";

const Screen3Card = ({ onPrevious, onNext, onLogin }) => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);

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
  };

  // Show create account modal if requested
  if (showCreateAccount) {
    return (
      <CreateAccountModal
        isOpen={true}
        onClose={() => {
          setShowCreateAccount(false);
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2 sm:mt-4">
            <button
              onClick={handleExistingAccount}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 active:scale-95 transition-all font-inter text-xs sm:text-sm min-h-[44px] whitespace-nowrap"
            >
              I already have an Account
            </button>
            <button
              onClick={handleCreateAccount}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-white text-[#6b4bff] font-medium rounded-full shadow-sm hover:bg-white/90 active:scale-95 transition-all font-inter text-sm min-h-[44px]"
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
