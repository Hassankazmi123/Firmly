import clearAppCache from "./cache";

export const logout = async () => {
  try {
    // Clear cache
    await clearAppCache();
    
    // Clear authentication tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Clear onboarding state
    localStorage.removeItem("onboardingStep");
    localStorage.removeItem("onboardingAuthTokens");
    localStorage.removeItem("onboardingShowCompleteProfile");
    localStorage.removeItem("onboardingShowAccountCreated");
    localStorage.removeItem("onboardingShowCreateAccount");
    localStorage.removeItem("onboardingComplete");

    // Clear Amalia Corner state
    localStorage.removeItem("amalia_diagnostic_thread_id");
    localStorage.removeItem("hasStartedDebrief");
    
    // Clear session storage completely
    sessionStorage.clear();
    
    // Mark that user has logged out
    localStorage.setItem("hasLoggedOut", "true");
    
    // Redirect to onboarding
    window.location.href = "/onboarding";
  } catch (error) {
    console.error("Logout error:", error);
    // Force redirect even if cache clearing fails
    window.location.href = "/onboarding";
  }
};

export default logout;
