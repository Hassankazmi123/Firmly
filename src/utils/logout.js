import clearAppCache from "./cache";

export const logout = async () => {
  try {
    // Clear cache
    await clearAppCache();
    
    // Clear authentication tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Clear onboarding step to restart from screen 1
    localStorage.removeItem("onboardingStep");
    
    // Clear session storage
    sessionStorage.clear();
    
    // Mark that user has logged out (so cache will be cleared on next load)
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
