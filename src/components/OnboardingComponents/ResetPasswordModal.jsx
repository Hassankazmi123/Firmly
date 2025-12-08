import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import Swal from "sweetalert2";

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Show success modal
      Swal.fire({
        html: `
          <div style="text-align: center; padding: 20px;">
            <div style="margin-bottom: 20px; display: flex; justify-content: center;">
              <img src="/assets/images/onboarding/Swal_Icon.webp" alt="Success" style="width: 80px; height: 80px;" />
            </div>
            <h2 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 16px; font-family: 'Cormorant', serif;">
              Password Changed Successfully
            </h2>
            <p style="font-size: 16px; color: #6B7280; margin-bottom: 0; font-family: 'Inter', sans-serif; line-height: 1.5;">
              Your password has been changed. You're ready to start your journey with Firmly.
            </p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "Continue",
        confirmButtonColor: "#374151",
        buttonsStyling: true,
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "px-8 py-3 rounded-full font-medium text-white",
        },
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to dashboard or login
          onClose();
        }
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <OnboardingLayout>
        <div className="w-full h-full flex items-center justify-center px-4 sm:px-6">
          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md relative">
            <h2 className="text-white text-xl sm:text-2xl font-semibold font-cormorant mb-2 sm:mb-3 text-left">
              Welcome Back
            </h2>

            <p className="text-white/80 text-xs sm:text-sm font-inter mb-4 sm:mb-6 leading-relaxed text-left">
              Let's update your password
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="text-left">
                <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Insert password"
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 active:scale-95 transition-all p-2"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Insert password"
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 active:scale-95 transition-all p-2"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#F26767] text-white text-xs sm:text-sm font-inter text-left flex items-center gap-2 sm:gap-3">
                  <img
                    src="/assets/images/onboarding/error_icon.webp"
                    alt=""
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-[#7C3AED] font-medium rounded-full hover:bg-white/95 active:scale-95 transition-all font-inter text-sm disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px]"
              >
                {isLoading && (
                  <span className="inline-block w-4 h-4 border-2 border-[#7C3AED]/60 border-t-transparent rounded-full animate-spin" />
                )}
                <span>Reset password</span>
              </button>
            </form>
          </div>
        </div>
      </OnboardingLayout>
    </div>
  );
};

export default ResetPasswordModal;
