import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import CompleteProfileModal from "./CompleteProfileModal";

// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;

const CreateAccountModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(() => {
    return localStorage.getItem("onboardingShowCompleteProfile") === "true";
  });
  const [authTokens, setAuthTokens] = useState(() => {
    const saved = localStorage.getItem("onboardingAuthTokens");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validations
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again");
      return;
    }

    setIsLoading(true);

    try {
      // Try with trailing slash which is standard for Django/DRF
      const registerResponse = await fetch(`${API_AUTH_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password_confirm: confirmPassword,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        // Handle various error response formats
        if (registerData.email) {
          setError(
            Array.isArray(registerData.email)
              ? registerData.email[0]
              : registerData.email,
          );
        } else if (registerData.password) {
          setError(
            Array.isArray(registerData.password)
              ? registerData.password[0]
              : registerData.password,
          );
        } else if (registerData.error) {
          setError(registerData.error);
        } else if (registerData.detail) {
          setError(registerData.detail);
        } else if (registerData.message) {
          setError(registerData.message);
        } else {
          setError("Registration failed. Please try again");
        }
        setIsLoading(false);
        return;
      }

      // After successful registration, automatically log in the user
      const loginResponse = await fetch(`${API_AUTH_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(
          "Account created but login failed. Please try logging in manually",
        );
        setIsLoading(false);
        return;
      }

      // Store tokens - handle different response formats
      let accessToken = null;
      let refreshToken = null;

      if (loginData.tokens) {
        accessToken = loginData.tokens.access || loginData.tokens.access_token;
        refreshToken =
          loginData.tokens.refresh || loginData.tokens.refresh_token;
      } else {
        accessToken =
          loginData.access ||
          loginData.access_token ||
          loginData.token ||
          loginData.key;
        refreshToken = loginData.refresh || loginData.refresh_token;
      }

      if (!accessToken) {
        console.error(
          "Login response missing access token. Response keys:",
          Object.keys(loginData),
        );
        if (loginData.tokens)
          console.error("Tokens object keys:", Object.keys(loginData.tokens));
        setError("Login failed: Invalid server response structure");
        setIsLoading(false);
        return;
      }

      const tokens = {
        access: accessToken,
        refresh: refreshToken,
      };

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      setAuthTokens(tokens);
      localStorage.setItem("onboardingAuthTokens", JSON.stringify(tokens));
      localStorage.setItem("onboardingShowCompleteProfile", "true");

      // Get user profile to check if profile is complete
      const profileResponse = await fetch(`${API_AUTH_URL}/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();

        // Check if profile needs to be completed
        const needsProfileCompletion =
          !profileData.first_name ||
          !profileData.last_name ||
          !profileData.age ||
          !profileData.job_role;

        if (needsProfileCompletion) {
          setShowCompleteProfile(true);
          localStorage.setItem("onboardingShowCompleteProfile", "true");
        } else {
          // Profile already complete, close modal
          localStorage.setItem("onboardingComplete", "true");
          localStorage.removeItem("onboardingShowCompleteProfile");
          localStorage.removeItem("onboardingShowCreateAccount");
          localStorage.removeItem("onboardingAuthTokens");
          onClose();
        }
      } else {
        // Assume profile needs completion if we can't fetch it
        setShowCompleteProfile(true);
        localStorage.setItem("onboardingShowCompleteProfile", "true");
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please check your connection and try again");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Show complete profile modal if account creation was successful
  if (showCompleteProfile) {
    return (
      <CompleteProfileModal
        isOpen={true}
        authTokens={authTokens}
        onClose={() => {
          setShowCompleteProfile(false);
          localStorage.removeItem("onboardingShowCompleteProfile");
          localStorage.removeItem("onboardingShowCreateAccount");
          localStorage.removeItem("onboardingAuthTokens");
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <OnboardingLayout>
        <div className="w-full min-h-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
          {/* Back button */}
          <button
            onClick={() => {
              localStorage.removeItem("onboardingShowCreateAccount");
              onClose();
            }}
            className="absolute top-16 sm:top-20 left-4 sm:left-6 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all z-30"
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

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-lg relative">
            {/* Step indicator */}
            <div className="text-white/70 text-xs sm:text-sm font-inter mb-3 sm:mb-4">
              1 of 2
            </div>

            <h2 className="text-white text-xl sm:text-2xl font-semibold font-cormorant mb-2 sm:mb-3 text-left">
              Create your account
            </h2>

            <p className="text-white/80 text-xs sm:text-sm font-inter mb-4 sm:mb-6 leading-relaxed text-left">
              Let's get started with your journey
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
                  disabled={isLoading}
                />
              </div>

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
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 active:scale-95 transition-all p-2"
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 active:scale-95 transition-all p-2"
                    disabled={isLoading}
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

              {/* Terms and Conditions */}
              <div className="flex items-center gap-2 sm:gap-3 text-left">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="appearance-none w-5 h-5 sm:w-4 sm:h-4 border border-white/25 rounded bg-transparent focus:outline-none focus:ring-1 focus:ring-white/50"
                    disabled={isLoading}
                  />
                  {agreeToTerms && (
                    <svg
                      className="absolute top-0 left-0 w-5 h-5 sm:w-4 sm:h-4 text-white pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="agreeToTerms"
                  className="text-white/80 text-xs sm:text-sm font-inter leading-relaxed"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-white underline hover:text-white/80 active:scale-95 transition-all inline"
                    disabled={isLoading}
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-white underline hover:text-white/80 active:scale-95 transition-all inline"
                    disabled={isLoading}
                  >
                    Privacy Policy
                  </button>
                </label>
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
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-[#7C3AED] font-medium rounded-full hover:bg-white/95 active:scale-95 transition-all font-inter text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
              >
                {isLoading && (
                  <span className="inline-block w-4 h-4 border-2 border-[#7C3AED]/60 border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isLoading ? "Creating Account..." : "Next"}</span>
              </button>
            </form>
          </div>
        </div>
      </OnboardingLayout>
    </div>
  );
};

export default CreateAccountModal;
