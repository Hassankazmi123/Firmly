import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import EmailSentModal from "./EmailSentModal";

// API Configuration
const API_BASE_URL = "http://16.16.141.229:8501";
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailSent, setShowEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_AUTH_URL}/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses
        if (data.email) {
          setError(Array.isArray(data.email) ? data.email[0] : data.email);
        } else if (data.error) {
          setError(data.error);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Failed to send reset link. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Success - show email sent modal
      setIsLoading(false);
      setShowEmailSent(true);
      console.log("Reset link sent to:", email);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Show email sent screen if email was sent
  if (showEmailSent) {
    return (
      <EmailSentModal
        isOpen={true}
        email={email}
        onClose={() => {
          setShowEmailSent(false);
          setEmail("");
          setError("");
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
              className="absolute top-6 sm:top-8 left-6 sm:left-8 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all z-30"
              disabled={isLoading}
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

            <div className="mt-8">
              <h2 className="text-white text-xl sm:text-2xl font-semibold font-cormorant mb-2 sm:mb-3 text-left">
                Forgot your password
              </h2>

              <p className="text-white/80 text-xs sm:text-sm font-inter mb-4 sm:mb-6 leading-relaxed text-left">
                Worry not! Enter your email below and we'll send you a reset link.
              </p>

              <div className="space-y-4 sm:space-y-5">
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
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#F26767] text-white text-xs sm:text-sm font-inter text-left flex items-center gap-2 sm:gap-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-[#7C3AED] font-medium rounded-full hover:bg-white/95 active:scale-95 transition-all font-inter text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {isLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-[#7C3AED]/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{isLoading ? "Sending Link..." : "Send link"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </OnboardingLayout>
    </div>
  );
};

export default ForgotPasswordModal;