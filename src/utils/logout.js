import clearAppCache from "./cache";

export const logout = async () => {
  try {
    await clearAppCache();

    localStorage.clear();
    sessionStorage.clear();

    localStorage.setItem("hasLoggedOut", "true");

    window.location.href = "/onboarding";
  } catch (error) {
    console.error("Logout error:", error);
    window.location.href = "/onboarding";
  }
};

export default logout;
