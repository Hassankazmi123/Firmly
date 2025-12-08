import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import EmailSentModal from "./EmailSentModal";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowEmailSent(true);
      console.log("Reset link sent to:", email);
    }, 1000);
  };

  if (!isOpen) return null;

  // Show email sent screen if email was sent
  if (showEmailSent) {
    return (
      <EmailSentModal
        isOpen={true}
        onClose={() => {
          setShowEmailSent(false);
          setEmail("");
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <OnboardingLayout>
        <div className="w-full h-full flex items-center justify-center px-4 sm:px-6">
          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md relative">
            {/* Back button inside card */}
            <button
              onClick={onClose}
              className="absolute top--1 left-0 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all z-30"
            >
              <svg
                className="w-6 h-6 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h2 className="text-white text-xl sm:text-2xl font-semibold font-cormorant mb-2 sm:mb-3 text-left">
              Forgot your password
            </h2>

            <p className="text-white/80 text-xs sm:text-sm font-inter mb-4 sm:mb-6 leading-relaxed text-left">
              Worry not! Enter your email below and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="text-left">
                <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Insert email address"
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-[#7C3AED] font-medium rounded-full hover:bg-white/95 active:scale-95 transition-all font-inter text-sm disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px]"
              >
                {isLoading && (
                  <span className="inline-block w-4 h-4 border-2 border-[#7C3AED]/60 border-t-transparent rounded-full animate-spin" />
                )}
                <span>Send link</span>
              </button>
            </form>
          </div>
        </div>
      </OnboardingLayout>
    </div>
  );
};

export default ForgotPasswordModal;
