import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProfile } from "../../../services/api";
import logout from "../../../utils/logout";
import Hero from "./Hero";
import NotificationPopup from "../notification/Notification";
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
  const [userInitials, setUserInitials] = useState("U");
  const [selectedTab, setSelectedTab] = useState(() => {
    if (location.pathname === "/amalia-corner") return "Amalia Corner";
    if (location.pathname === "/dashboard") return "Dashboard";
    return null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLTDropdownOpen, setIsLTDropdownOpen] = useState(false);
  const mobileToggleRef = useRef(null);
  const ltToggleRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile && profile.first_name && profile.last_name) {
          const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
          setUserInitials(initials);
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
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-[#6664D3] 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 px-4 py-2 rounded-b-3xl relative overflow-visible">
      <img
        src="/assets/images/dashboard/dashtop.webp"
        alt="dashboard top background"
        className="absolute top-0 left-0 w-[613px] z-0 h-[515px] object-cover object-top pointer-events-none"
      />
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
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
            <div className="flex items-center space-x-2">
              <img
                src="/assets/images/dashboard/starwhite.webp"
                alt="user icon"
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
              <span className="text-white/70 text-sm sm:text-base">Amalia</span>
              <span className="text-sm flex items-center justify-center bg-[#7d7cd9] border border-white/20 text-white/70 px-2 py-0.5 rounded-full">
                • online
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen((s) => !s)}
            className="relative text-white  p-2 rounded-lg transition-colors"
            aria-expanded={isNotificationOpen}
            aria-label="Toggle notifications"
            type="button"
          >
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-2 h-2.5 w-2.5 bg-[#D46FA8] rounded-full" />
          </button>
          <div className="relative z-[200]">
            <button
              ref={ltToggleRef}
              onClick={() => setIsLTDropdownOpen((s) => !s)}
              className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg transition-colors"
              aria-expanded={isLTDropdownOpen}
              aria-haspopup="true"
              type="button"
            >
              <span className="text-sm lg:text-lg font-semibold bg-[#7d7cd9] border border-white/20 text-white/70 px-4 py-3 rounded-2xl">
                {userInitials}
              </span>
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
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  Account settings
                </button>
                <button
                  onClick={() => {
                    setIsLTDropdownOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200"
                  type="button"
                >
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
      <NotificationPopup
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </header>
  );
};
export default DashboardHeader;