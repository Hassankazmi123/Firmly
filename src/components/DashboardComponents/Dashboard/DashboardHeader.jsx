import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProfile, API_URL } from "../../../services/api";
import logout from "../../../utils/logout";
import { useMainNavTransition } from "../../../context/MainNavTransitionContext";
import Hero from "./Hero";
const PortalDropdown = ({
  children,
  anchorRef,
  open,
  onClose,
  placement = "bottom-right",
  className = "",
}) => {
  const elRef = useRef(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }
  useEffect(() => {
    const el = elRef.current;
    el.style.position = "absolute";
    el.style.pointerEvents = "auto";
    el.style.zIndex = "9999";
    el.className = className;
    document.body.appendChild(el);
    return () => {
      try {
        document.body.removeChild(el);
      } catch (e) { }
    };
  }, [className]);
  useEffect(() => {
    const el = elRef.current;
    if (!open || !anchorRef?.current || !el) return;
    const anchor = anchorRef.current;
    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    const top = rect.bottom + margin + window.scrollY;
    const left = rect.right - el.offsetWidth + window.scrollX;
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    const adjust = () => {
      const elRect = el.getBoundingClientRect();
      let newLeft = elRect.left;
      let newTop = elRect.top;
      if (elRect.right > window.innerWidth) {
        newLeft = Math.max(8, window.innerWidth - elRect.width - 8);
      }
      if (elRect.left < 8) {
        newLeft = 8;
      }
      if (elRect.bottom > window.innerHeight) {
        newTop = rect.top - elRect.height - margin + window.scrollY;
      }
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    };
    const t = setTimeout(adjust, 0);
    const onResize = () => setTimeout(adjust, 0);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, anchorRef]);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return ReactDOM.createPortal(children, elRef.current);
};

const DashboardHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainNav = useMainNavTransition();
  const [userImage, setUserImage] = useState(null);
  const [userInitials, setUserInitials] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        
        // Handle profile image from localStorage
        if (parsed.profile_image) {
          let imageUrl = parsed.profile_image;
          if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
            imageUrl = `${API_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
          }
          // Note: we can't call setUserImage here, but we'll do it in a useEffect next
        }

        if (parsed.first_name && parsed.last_name) {
          return `${parsed.first_name.charAt(0)}${parsed.last_name.charAt(0)}`.toUpperCase();
        }
      }
    } catch (e) {
      console.warn("Failed to parse user from localStorage:", e);
    }
    return "U";
  });

  // Load userImage from localStorage on mount and sync on storage events
  useEffect(() => {
    const syncProfile = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          if (parsed.profile_image) {
            let imageUrl = parsed.profile_image;
            if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
              imageUrl = `${API_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            setUserImage(imageUrl);
          } else {
            setUserImage(null);
          }
          if (parsed.first_name && parsed.last_name) {
            setUserInitials(`${parsed.first_name.charAt(0)}${parsed.last_name.charAt(0)}`.toUpperCase());
          }
        } catch (e) {}
      }
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    return () => window.removeEventListener("storage", syncProfile);
  }, []);
  const [selectedTab, setSelectedTab] = useState(() => {
    if (location.pathname === "/amalia-corner") return "Amalia Corner";
    if (location.pathname === "/dashboard") return "Dashboard";
    return null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLTDropdownOpen, setIsLTDropdownOpen] = useState(false);
  const mobileToggleRef = useRef(null);
  const ltToggleRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          if (profile.first_name && profile.last_name) {
            const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
            setUserInitials(initials);
          }
          if (profile.profile_image) {
            let imageUrl = profile.profile_image;
            if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
              imageUrl = `${API_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            setUserImage(imageUrl);
          } else {
            setUserImage(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, []);
  useEffect(() => {
    if (location.pathname === "/amalia-corner") setSelectedTab("Amalia Corner");
    else if (location.pathname === "/dashboard") setSelectedTab("Dashboard");
    else setSelectedTab(null);
    setIsMobileMenuOpen(false);
    setIsLTDropdownOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const handler = (e) => {
      if (isMobileMenuOpen) {
        const toggle = mobileToggleRef.current;
        const path = e.composedPath ? e.composedPath() : e.path || [];
        const clickedInsideToggle =
          toggle && (path.includes(toggle) || toggle.contains(e.target));
        const clickedInsideDropdown = path.some(
          (n) => n?.dataset?.dashboardMobileMenu === "true"
        );
        if (!clickedInsideToggle && !clickedInsideDropdown)
          setIsMobileMenuOpen(false);
      }
      if (isLTDropdownOpen) {
        const toggle = ltToggleRef.current;
        const path = e.composedPath ? e.composedPath() : e.path || [];
        const clickedInsideToggle =
          toggle && (path.includes(toggle) || toggle.contains(e.target));
        const clickedInsideDropdown = path.some(
          (n) => n?.dataset?.dashboardLtMenu === "true"
        );
        if (!clickedInsideToggle && !clickedInsideDropdown)
          setIsLTDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isMobileMenuOpen, isLTDropdownOpen]);
  const goTo = (path, tabName = null) => {
    if (tabName) setSelectedTab(tabName);
    window.scrollTo(0, 0);
    if (mainNav?.navigateMainView) mainNav.navigateMainView(path);
    else navigate(path);
    setIsMobileMenuOpen(false);
  };
  const goMain = (path) => {
    window.scrollTo(0, 0);
    mainNav?.navigateMainView ? mainNav.navigateMainView(path) : navigate(path);
  };
  return (
    <>
    <header className="bg-[#6664D3] 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 px-4 py-2 rounded-b-3xl relative overflow-visible">
      <img
        src="/assets/images/dashboard/dashtop.webp"
        alt="dashboard top background"
        className="absolute top-0 left-0 w-[613px] z-0 h-[515px] object-cover object-top pointer-events-none"
      />
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={() => goMain("/dashboard")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          type="button"
          aria-label="Go to Dashboard"
        >
          <img
            src="/assets/images/dashboard/logowhite.webp"
            alt="firmly logo"
            className="h-7 w-auto"
          />
        </button>
        <nav className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => goTo("/dashboard", "Dashboard")}
            className={`px-6 py-2 rounded-xl transition-colors ${selectedTab === "Dashboard"
              ? "bg-[#7d7cd9] border border-white/20 text-white"
              : "text-white/70 hover:text-white"
              }`}
            type="button"
            aria-current={selectedTab === "Dashboard" ? "page" : undefined}
          >
            Dashboard
          </button>
          <button
            onClick={() => goTo("/amalia-corner", "Amalia Corner")}
            className={`px-6 py-2 rounded-xl transition-colors ${selectedTab === "Amalia Corner"
              ? "bg-[#7d7cd9] border border-white/20 text-white"
              : "text-white/70 hover:text-white"
              }`}
            type="button"
            aria-current={selectedTab === "Amalia Corner" ? "page" : undefined}
          >
            Amalia Corner
          </button>
        </nav>
        <div className="flex items-center sm:space-x-4 relative z-[200]">
          <div className="hidden sm:flex items-center space-x-2 text-white">
            <div
              onClick={() => goMain("/amalia-corner")}
              className="flex items-center space-x-2 cursor-pointer group relative z-[220] pointer-events-auto"
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/assets/images/dashboard/starwhite.webp"
                alt="user icon"
                className="h-5 w-5 sm:h-6 sm:w-6 transform group-hover:scale-125 transition-all duration-300 pointer-events-none"
              />
              <span className="text-white/70 text-sm sm:text-base group-hover:text-white transition-colors pointer-events-none">
                Amalia
              </span>
            </div>
          </div>
          <div className="relative z-[200]">
            <button
              ref={ltToggleRef}
              onClick={() => setIsLTDropdownOpen((s) => !s)}
              className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg transition-colors"
              aria-expanded={isLTDropdownOpen}
              aria-haspopup="true"
              type="button"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-2xl bg-[#7d7cd9] border border-white/20 overflow-hidden relative z-[210]">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      setUserImage(null);
                    }}
                  />
                ) : (
                  <span className="text-sm lg:text-lg font-semibold text-white/70">
                    {userInitials}
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isLTDropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <PortalDropdown
              anchorRef={ltToggleRef}
              open={isLTDropdownOpen}
              onClose={() => setIsLTDropdownOpen(false)}
              className="dashboard-lt-portal"
            >
              <div
                data-dashboard-lt-menu="true"
                className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                style={{ minWidth: 180 }}
              >
                <button
                  onClick={() => {
                    setIsLTDropdownOpen(false);
                    navigate("/dashboard/account-settings");
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account settings
                </button>
                <button
                  onClick={() => {
                    setIsLTDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                  type="button"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </PortalDropdown>
          </div>
          <div className="md:hidden relative">
            <button
              ref={mobileToggleRef}
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              style={{
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
              className="text-white p-2 rounded-lg hover:bg-[#7d7cd9] transition-colors z-[210]"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <PortalDropdown
              anchorRef={mobileToggleRef}
              open={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              className="dashboard-mobile-portal"
            >
              <div
                data-dashboard-mobile-menu="true"
                className="bg-white border border-white/20 rounded-lg shadow-lg overflow-hidden"
                style={{ minWidth: 200 }}
              >
                <button
                  onClick={() => goTo("/dashboard", "Dashboard")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${selectedTab === "Dashboard"
                    ? "text-[#6664D3]"
                    : "text-gray-700"
                    }`}
                  type="button"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => goTo("/amalia-corner", "Amalia Corner")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium border-t transition-colors ${selectedTab === "Amalia Corner"
                    ? "text-[#6664D3]"
                    : "text-gray-700"
                    }`}
                  type="button"
                >
                  Amalia Corner
                </button>
              </div>
            </PortalDropdown>
          </div>
        </div>
      </div>
      <div className="relative z-20 mt-4">
        <Hero />
      </div>
      <img
        src="/assets/images/dashboard/dashbottom.webp"
        alt="dashboard bottom background"
        className="absolute bottom-0 right-0 w-[613px] z-0 h-[515px] object-cover object-bottom pointer-events-none"
      />
    </header>
    </>
  );
};
export default DashboardHeader;