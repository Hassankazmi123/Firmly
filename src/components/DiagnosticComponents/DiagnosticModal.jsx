import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProfile } from "../../services/api";
import DiagnosticWarningModal from "../DashboardComponents/AllModals/DiagnosticWarningModal";

const DiagnosticModal = () => {
  const navigate = useNavigate();
  const [userInitials, setUserInitials] = useState("U");

  // Inlined Header2 state and behavior so header markup can be edited here
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(() => {
    if (location.pathname === "/amalia-corner") return "Amalia Corner";
    if (location.pathname === "/dashboard") return "Dashboard";
    return null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLTDropdownOpen, setIsLTDropdownOpen] = useState(false);
  const [showDiagWarning, setShowDiagWarning] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile && profile.first_name && profile.last_name) {
          const initials =
            `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
          setUserInitials(initials);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const diagnosticComplete =
      localStorage.getItem("diagnosticComplete") === "true";
    if (diagnosticComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const menuRef = useRef(null);
  const ltDropdownRef = useRef(null);
  const mobileToggleRef = useRef(null);
  useEffect(() => {
    if (location.pathname === "/amalia-corner") {
      setSelectedTab("Amalia Corner");
    } else if (location.pathname === "/dashboard") {
      setSelectedTab("Dashboard");
    } else {
      setSelectedTab(null);
    }
    setIsMobileMenuOpen(false);
    setIsLTDropdownOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        ltDropdownRef.current &&
        !ltDropdownRef.current.contains(event.target)
      ) {
        setIsLTDropdownOpen(false);
      }
    };
    if (isMobileMenuOpen || isLTDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen, isLTDropdownOpen]);
  const goTo = (path, tabName = null) => {
    if (tabName) setSelectedTab(tabName);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleStartDiagnostic = () => {
    navigate("/diagnostic/steps");
  };

  // This modal renders the non-completed diagnostic landing; completed
  // UI is moved to a separate `DiagnosticComplete` component/route.

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Shared Header (inlined from Header2.jsx) - edit/comment as needed */}
      <header className="bg-[#ababab] 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 py-1.5 px-4 sticky top-0 z-50">
        <div className="relative z-20 flex items-center justify-between h-12">
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
          <div className="flex items-center sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-white">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/images/dashboard/starwhite.webp"
                  alt="user icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
                <span className="text-white/70 text-sm sm:text-base">
                  Amalia
                </span>
              </div>
            </div>
            <div className="relative" ref={ltDropdownRef}>
              <button
                onClick={() => setIsLTDropdownOpen((s) => !s)}
                className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg transition-colors"
                aria-expanded={isLTDropdownOpen}
                aria-haspopup="true"
                type="button"
              >
                <span className="text-sm lg:text-lg font-semibold bg-[#ababab] border border-white/20 text-white/70 px-3 py-2 rounded-2xl">
                  {userInitials}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isLTDropdownOpen ? "rotate-180" : ""
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
              {isLTDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-40 overflow-hidden">
                  <button
                    onClick={() => {
                      setIsLTDropdownOpen(false);
                      const isDiagComplete = localStorage.getItem("hasStartedDebrief") === "true";
                      if (isDiagComplete) {
                        navigate("/dashboard/account-settings");
                      } else {
                        setShowDiagWarning(true);
                      }
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
                </div>
              )}
            </div>
            <div className="md:hidden relative" ref={menuRef}>
              <button
                ref={mobileToggleRef}
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                style={{
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                }}
                className="text-white p-2 rounded-lg transition-colors"
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
              {isMobileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border border-white/20 rounded-lg shadow-lg z-50 overflow-hidden"
                  style={{ top: "calc(100% + 8px)" }}
                >
                  <button
                    onClick={() => goTo("/dashboard", "Dashboard")}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      selectedTab === "Dashboard"
                        ? "text-[#6664D3]"
                        : "text-gray-700 "
                    }`}
                    type="button"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => goTo("/amalia-corner", "Amalia Corner")}
                    className={`w-full text-left px-4 py-3 text-sm font-medium border-t transition-colors ${
                      selectedTab === "Amalia Corner"
                        ? "text-[#6664D3]"
                        : "text-gray-700"
                    }`}
                    type="button"
                  >
                    Amalia Corner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <DiagnosticWarningModal 
        isOpen={showDiagWarning} 
        onClose={() => setShowDiagWarning(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center border-[8px] sm:border-[12px] md:border-[16px] border-[#f5f5f5] relative overflow-hidden bg-[#ebebeb] rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/images/onboarding/Diagnostic_bg.webp"
            alt="onboarding background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="absolute top-0 left-0 pointer-events-none hidden md:block">
          <img
            src="/assets/images/onboarding/Diagnostic_Topleft.webp"
            alt="top left"
            className="w-50 h-50 "
          />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none hidden md:block">
          <img
            src="/assets/images/onboarding/Diagnostic_Topright.webp"
            alt="top right"
            className="w-50 h-50 "
          />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none hidden md:block">
          <img
            src="/assets/images/onboarding/Diagnostic_Bottomright.webp"
            alt="bottom right"
            className="w-50 h-50"
          />
        </div>
        {/* Make inner content full-width so left and right sections hug the edges */}
        <div className="w-full relative z-10 px-4 sm:px-6">
          {/* Content State */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Left Side - Description */}
            <div className="lg:col-span-7 pt-6 sm:pt-8 md:pt-12 lg:pt-16">
              <>
                {/* Circular Progress Indicator */}
                <div className="mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-[#a3a3a3] flex items-center justify-center bg-[#ebebeb] shadow-sm">
                    <span className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 font-inter">
                      0%
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 font-cormorant">
                  Firmly Diagnostic
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-inter">
                  This diagnostic assessment evaluates your work preferences and
                  leadership tendencies using validated organizational
                  psychology measures. The items target key factors that
                  research shows significantly impact women's workplace
                  effectiveness and advancement. Your results will inform a
                  personalized development plan focused on accelerating your
                  leadership growth. Ready to get started?
                </p>
                <button
                  onClick={handleStartDiagnostic}
                  className="bg-gray-800 text-white px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-gray-900 active:scale-95 transition-all font-inter text-sm min-h-[44px]"
                >
                  Start Diagnostic
                </button>
              </>
            </div>

            {/* Right Side - Instructions */}
            <div className="lg:col-span-5 bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md w-full lg:w-auto max-w-[500px] mx-auto lg:mx-0 relative pt-10 sm:pt-12 mb-6 sm:mb-8 md:mb-0">
              <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-[#855cc9]">
                <img
                  src="/assets/images/onboarding/DiagLeft.webp"
                  alt="card top decoration"
                  className="w-full h-10 sm:h-12 object-cover"
                />
              </div>
              <>
                <div className="flex items-center gap-2 text-gray-700 mb-2 mt-2 sm:mt-4">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-inter">15 min</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 font-cormorant">
                  How to complete your assessment:
                </h2>
                <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-gray-700 font-inter">
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold min-w-fit">
                      •
                    </span>
                    <span>
                      Read each statement and think about it in the context of
                      your current work and workplace
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold min-w-fit">
                      •
                    </span>
                    <span>
                      Drag the slider along the scale: far left to strongly
                      disagree, far right to strongly agree, or anywhere in
                      between to match your level of agreement
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold min-w-fit">
                      •
                    </span>
                    <span>
                      Trust your instincts and respond honestly based on your
                      current workplace experience
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold min-w-fit">
                      •
                    </span>
                    <span>
                      Click "Next" in the top right corner to move to the next
                      question
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-purple-600 font-bold min-w-fit">
                      •
                    </span>
                    <span>
                      Remember, your authentic responses will give us the
                      clearest picture of your leadership development
                      opportunities
                    </span>
                  </li>
                </ul>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticModal;
