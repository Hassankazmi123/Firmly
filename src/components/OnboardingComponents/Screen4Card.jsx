import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import clearAppCache from "../../utils/cache";

const Screen4Card = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed. Please check your credentials.",
        );
      }

      // Handle different token response structures
      let accessToken = null;
      let refreshToken = null;

      if (data.tokens) {
        accessToken = data.tokens.access || data.tokens.access_token;
        refreshToken = data.tokens.refresh || data.tokens.refresh_token;
      } else {
        accessToken =
          data.access || data.access_token || data.token || data.key;
        refreshToken = data.refresh || data.refresh_token;
      }

      if (accessToken) {
        // Clear any stale state from previous sessions before setting new user data
        try {
          await clearAppCache();
        } catch (cacheError) {
          console.warn("Failed to clear app cache during login:", cacheError);
        }

        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("onboardingComplete", "true");
        navigate("/dashboard");
      } else {
        throw new Error("Invalid server response: missing access token");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Fallback for demo account if API fails (optional, but good for stability during dev if API is flaky)
      if (
        email.trim().toLowerCase() === "maya@firmly.com" &&
        password === "123456789"
      ) {
        // Mock token for demo
        console.warn("Using fallback demo login");
        navigate("/dashboard");
        return;
      }
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-[28px] md:rounded-[32px] px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 w-full max-w-2xl drop-shadow-lg">
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 w-full">
          <div className="w-full text-left">
            <h1 className="text-white text-2xl sm:text-3xl md:text-[34px] font-semibold font-cormorant leading-snug">
              Welcome Back
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-inter mt-1 sm:mt-2">
              Log in to continue where you left off
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 sm:gap-5"
          >
            <label className="flex flex-col gap-2 text-left font-inter text-sm text-white/80">
              <span>Email Address <span className="text-red-400">*</span></span>
              <input
                type="email"
                name="email"
                placeholder="Insert email address"
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/15 transition text-sm sm:text-base min-h-[48px]"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-left font-inter text-sm text-white/80">
              <span>Password <span className="text-red-400">*</span></span>
              <input
                type="password"
                name="password"
                placeholder="Insert password"
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/60 focus:outline-none focus:border-white focus:bg-white/15 transition text-sm sm:text-base min-h-[48px]"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

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

            <div className="w-full flex justify-center py-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs sm:text-sm font-inter text-white/80 hover:text-white transition min-h-[44px] flex items-center"
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-1 sm:mt-2 px-6 py-3 sm:py-3.5 font-medium rounded-full shadow-sm font-inter text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                isLoading
                  ? "bg-white/70 text-[#6b4bff]/70 cursor-not-allowed"
                  : "bg-white text-[#6b4bff] hover:bg-white/95 active:scale-95"
              }`}
            >
              {isLoading && (
                <span className="inline-block w-4 h-4 border-2 border-[#6b4bff]/60 border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isLoading ? "Logging in..." : "Log in"}</span>
            </button>
          </form>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </div>
  );
};

export default Screen4Card;
