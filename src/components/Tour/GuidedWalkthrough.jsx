import React, { useState, useEffect, useRef } from "react";
import DiagnosticDebriefModal from "../DashboardComponents/AllModals/DiagnosticDebriefModal";

const steps = [
  {
    id: "visual-summary",
    title: "Visual Summary",
    content: [
      "This visual summary displays your scores across six research-backed metrics.",
      "These metrics impact women's workplace effectiveness and leadership potential.",
      "Each metric represents a key area for targeted development.",
      "Focused improvement in these areas can accelerate your career growth.",
    ],
    targetSelector: '[data-tour="radar-chart"]',
    position: "bottom-right",
  },
  {
    id: "composite-score",
    title: "Composite Score",
    content: [
      "This is your composite score, averaging all six metrics to give you a snapshot of your current leadership development baseline.",
      "This number represents where you are today - your starting point for growth.",
      "Whether it's higher or lower than you expected, it's valuable data that helps me tailor your coaching journey to maximize your leadership potential.",
    ],
    targetSelector: '[data-tour="overall-score"]',
    position: "bottom-left",
  },
  {
    id: "grow-glow",
    title: "Grow & Glow Areas",
    content: [
      'Your "glow" areas are the strengths where you\'re already excelling - these are leadership capabilities to celebrate and leverage.',
      'Your "grow" areas represent your greatest opportunities for development - the metrics where focused attention can create the most significant impact on your leadership effectiveness.',
    ],
    targetSelector: '[data-tour="grow-glow"]',
    position: "top",
  },
  {
    id: "leadership-pathway",
    title: "Leadership Pathway",
    content: [
      "Based on your diagnostic results, I'll analyze your unique profile and create a personalized development plan tailored specifically to your needs.",
      "This plan breaks down your leadership growth into manageable, bite-sized action items that you can tackle at your own pace, ensuring your development journey is both effective and sustainable.",
    ],
    targetSelector: '[data-tour="leadership-pathway"]',
    position: "top",
  },
  {
    id: "amalia-corner",
    title: "Amalia Corner",
    content: [
      "You'll always find me here! Whenever you need guidance, have questions about your development plan, or want to discuss your leadership journey, just click here to connect with me.",
    ],
    targetSelector: '[data-tour="amalia-corner"]',
    position: "top-left",
  },
];

const GuidedWalkthrough = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [highlightRect, setHighlightRect] = useState(null);
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });
  const overlayRef = useRef(null);

  // Check if user has already seen the walkthrough
  const hasSeenWalkthrough = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("firmly_walkthrough_completed") === "true";
  };

  // Mark walkthrough as completed
  const markWalkthroughCompleted = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("firmly_walkthrough_completed", "true");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Only show walkthrough if user hasn't seen it before
    if (hasSeenWalkthrough()) {
      return;
    }

    // Check if screen is mobile (width < 640px) - hide walkthrough on mobile
    const checkMobile = () => {
      return window.innerWidth < 640;
    };

    // If mobile, mark as completed and don't show walkthrough
    if (checkMobile()) {
      markWalkthroughCompleted();
      return;
    }

    const delay = 1000;
    const timer = setTimeout(() => {
      // Double-check mobile before activating (in case of resize)
      if (checkMobile()) {
        markWalkthroughCompleted();
        return;
      }
      // Mark as seen immediately when walkthrough starts
      // This prevents it from showing again on refresh or tab switch
      markWalkthroughCompleted();
      setIsActive(true);
      setCurrentStep(0);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isActive || currentStep === -1) {
      setHighlightedElement(null);
      setHighlightRect(null);
      // Clean up any applied styles when walkthrough ends
      steps.forEach((step) => {
        const element = document.querySelector(step.targetSelector);
        if (element) {
          element.style.zIndex = "";
          const computedPosition = getComputedStyle(element).position;
          if (computedPosition === "relative" && element.style.position) {
            element.style.position = "";
          }
        }
      });
      return;
    }

    const step = steps[currentStep];
    if (!step) return;

    const updateHighlight = () => {
      const element = document.querySelector(step.targetSelector);
      if (element) {
        setHighlightedElement(element);
        const rect = element.getBoundingClientRect();
        setHighlightRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        // Scroll handling for different steps
        if (currentStep === 2 && step.id === "grow-glow") {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        } else if (currentStep === 3 && step.id === "leadership-pathway") {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        } else {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      }
    };

    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight, true);

    return () => {
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight, true);
      setHighlightRect(null);
    };
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Close walkthrough completely first
      setIsActive(false);
      setCurrentStep(-1);
      setHighlightedElement(null);
      setHighlightRect(null);
      
      // Clean up any applied styles
      steps.forEach((step) => {
        const element = document.querySelector(step.targetSelector);
        if (element) {
          element.style.zIndex = "";
          const computedPosition = getComputedStyle(element).position;
          if (computedPosition === "relative" && element.style.position) {
            element.style.position = "";
          }
        }
      });
      
      markWalkthroughCompleted();
      
      // Scroll to top of dashboard when walkthrough is completed
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      if (onComplete) onComplete();
    }
  };

  const handleGetDebrief = () => {
    // Handle the "Get Debrief" action
    // You can navigate to a specific page or trigger an action here
    console.log("Get Debrief clicked");
  };

  // Always render modal, even when walkthrough is not active
  // Don't render walkthrough if not active or on mobile screen
  const isMobileScreen = windowSize.width < 640;
  if (!isActive || currentStep === -1 || isMobileScreen) {
    return (
      <>
        <DiagnosticDebriefModal
          isOpen={isDebriefModalOpen}
          onClose={() => setIsDebriefModalOpen(false)}
          onGetDebrief={handleGetDebrief}
        />
      </>
    );
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  const targetElement = highlightedElement;
  let modalStyle = {};
  let overlayStyle = {};
  let cutoutStyle = {};

  if (targetElement && highlightRect) {
    const rect = targetElement.getBoundingClientRect();
    const viewportWidth = windowSize.width;
    const viewportHeight = windowSize.height;

    const isMobile = viewportWidth < 640;
    const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

    const padding = 8;
    // Use viewport-relative coordinates for cutout (getBoundingClientRect gives viewport coords)
    const cutoutTop = rect.top - padding;
    const cutoutLeft = rect.left - padding;
    const cutoutRight = rect.right + padding;
    const cutoutBottom = rect.bottom + padding;
    const cutoutWidth = cutoutRight - cutoutLeft;
    const cutoutHeight = cutoutBottom - cutoutTop;

    overlayStyle = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9998,
      pointerEvents: "none",
    };

    cutoutStyle = {
      top: cutoutTop,
      left: cutoutLeft,
      width: cutoutWidth,
      height: cutoutHeight,
    };

    let modalWidth;
    let modalHeight;
    let horizontalPadding;
    let verticalPadding;

    if (isMobile) {
      modalWidth = Math.min(viewportWidth - 32, 360);
      modalHeight = Math.min(viewportHeight * 0.7, 420);
      horizontalPadding = 16;
      verticalPadding = 16;
    } else if (isTablet) {
      modalWidth = Math.min(viewportWidth - 48, 480);
      modalHeight = Math.min(viewportHeight * 0.65, 380);
      horizontalPadding = 24;
      verticalPadding = 20;
    } else {
      modalWidth = Math.min(viewportWidth - 80, 550);
      modalHeight = Math.min(viewportHeight * 0.6, 360);
      horizontalPadding = 40;
      verticalPadding = 20;
    }

    let top = 0;
    let left = 0;

    // Use viewport coordinates directly (rect is already in viewport coordinates)
    const elementTop = rect.top;
    const elementLeft = rect.left;
    const elementBottom = rect.bottom;
    const elementRight = rect.right;

    if (isMobile) {
      // Mobile: Center modal below or above element
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      if (spaceBelow >= modalHeight + 20 || spaceBelow > spaceAbove) {
        // Position below
        top = Math.min(
          elementBottom + 16,
          viewportHeight - modalHeight - verticalPadding
        );
      } else {
        // Position above
        top = Math.max(
          elementTop - modalHeight - 16,
          verticalPadding
        );
      }
      
      left = Math.max(
        horizontalPadding,
        Math.min(
          (viewportWidth - modalWidth) / 2,
          viewportWidth - modalWidth - horizontalPadding
        )
      );
    } else if (isTablet) {
      if (currentStep === 1 && currentStepData.id === "composite-score") {
        if (rect.left - modalWidth - 20 > 0) {
          left = elementLeft - modalWidth - 20;
          top = Math.max(
            verticalPadding,
            Math.min(
              elementTop,
              viewportHeight - modalHeight - verticalPadding
            )
          );
        } else {
          top = elementBottom + 20;
          left = Math.max(
            horizontalPadding,
            Math.min(
              (viewportWidth - modalWidth) / 2,
              viewportWidth - modalWidth - horizontalPadding
            )
          );
        }
      } else if (currentStep === 2 && currentStepData.id === "grow-glow") {
        // Position below, centered
        top = Math.min(
          elementBottom + 20,
          viewportHeight - modalHeight - verticalPadding
        );
        left = Math.max(
          horizontalPadding,
          Math.min(
            (viewportWidth - modalWidth) / 2,
            viewportWidth - modalWidth - horizontalPadding
          )
        );
      } else if (
        currentStep === 3 &&
        currentStepData.id === "leadership-pathway"
      ) {
        // Position above, centered
        top = Math.max(
          verticalPadding,
          elementTop - modalHeight - 20
        );
        left = Math.max(
          horizontalPadding,
          Math.min(
            (viewportWidth - modalWidth) / 2,
            viewportWidth - modalWidth - horizontalPadding
          )
        );
      } else {
        top = elementBottom + 20;
        left = Math.max(
          horizontalPadding,
          Math.min(
            elementLeft,
            viewportWidth - modalWidth - horizontalPadding
          )
        );
      }
    } else {
      // Desktop
      if (currentStep === 1 && currentStepData.id === "composite-score") {
        left = elementLeft - modalWidth - 20;
        top = elementTop;

        if (left < horizontalPadding) {
          left = horizontalPadding;
          top = elementTop;
        }
      } else if (currentStep === 2 && currentStepData.id === "grow-glow") {
        // Position based on available space
        const spaceRight = viewportWidth - rect.right;
        const spaceBelow = viewportHeight - rect.bottom;
        
        if (spaceRight >= modalWidth + 20) {
          // Position to the right
          left = elementRight + 20;
          top = Math.max(
            verticalPadding,
            Math.min(
              elementTop,
              viewportHeight - modalHeight - verticalPadding
            )
          );
        } else if (spaceBelow >= modalHeight + 20) {
          // Position below, aligned to right
          top = elementBottom + 20;
          left = Math.max(
            horizontalPadding,
            Math.min(
              elementRight - modalWidth,
              viewportWidth - modalWidth - horizontalPadding
            )
          );
        } else {
          // Position above, aligned to right
          top = Math.max(
            verticalPadding,
            elementTop - modalHeight - 20
          );
          left = Math.max(
            horizontalPadding,
            Math.min(
              elementRight - modalWidth,
              viewportWidth - modalWidth - horizontalPadding
            )
          );
        }
      } else if (
        currentStep === 3 &&
        currentStepData.id === "leadership-pathway"
      ) {
        // Position above, aligned to right
        const spaceAbove = rect.top;
        const spaceRight = viewportWidth - rect.right;
        
        if (spaceAbove >= modalHeight + 20) {
          top = elementTop - modalHeight - 20;
        } else {
          // If not enough space above, position below
          top = Math.min(
            elementBottom + 20,
            viewportHeight - modalHeight - verticalPadding
          );
        }
        
        if (spaceRight >= modalWidth + 20) {
          left = elementRight + 20;
        } else {
          left = Math.max(
            horizontalPadding,
            Math.min(
              elementRight - modalWidth,
              viewportWidth - modalWidth - horizontalPadding
            )
          );
        }
      } else {
        const position = currentStepData.position;
        if (position === "bottom-left") {
          top = elementBottom + 20;
          left = elementLeft;
        } else if (position === "bottom-right") {
          if (rect.right + modalWidth + 20 <= viewportWidth) {
            top = elementBottom - modalHeight;
            if (top < verticalPadding) {
              top = verticalPadding;
            }
            left = elementRight + 20;
          } else {
            top = elementBottom + 20;
            left = Math.max(
              elementRight - modalWidth,
              elementLeft
            );
          }
        } else if (position === "top") {
          top = elementTop - modalHeight - 20;
          left = elementLeft + (rect.width - modalWidth) / 2;
        } else if (position === "top-left") {
          top = elementTop - modalHeight - 20;
          left = elementLeft;
        } else {
          top = elementBottom + 20;
          left = elementLeft;
        }
      }
    }

    // Boundary checks (viewport coordinates)
    if (left + modalWidth > viewportWidth) {
      left = viewportWidth - modalWidth - horizontalPadding;
    }
    if (left < horizontalPadding) {
      left = horizontalPadding;
    }
    if (top + modalHeight > viewportHeight) {
      top = Math.max(
        verticalPadding,
        viewportHeight - modalHeight - verticalPadding
      );
    }
    if (top < verticalPadding) {
      top = verticalPadding;
    }

    modalStyle = {
      position: "fixed",
      top: top + "px",
      left: left + "px",
      width: modalWidth + "px",
      height: modalHeight + "px",
      maxHeight: modalHeight + "px",
      zIndex: 9999,
    };

    if (targetElement) {
      targetElement.style.zIndex = "9997";
      if (getComputedStyle(targetElement).position === "static") {
        targetElement.style.position = "relative";
      }
    }
  }

  return (
    <>
      <div
        ref={overlayRef}
        style={overlayStyle}
        className="fixed inset-0 z-[9998]"
      >
        {cutoutStyle && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: cutoutStyle.top + "px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: cutoutStyle.top + cutoutStyle.height + "px",
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: cutoutStyle.top + "px",
                left: 0,
                width: cutoutStyle.left + "px",
                height: cutoutStyle.height + "px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: cutoutStyle.top + "px",
                left: cutoutStyle.left + cutoutStyle.width + "px",
                right: 0,
                height: cutoutStyle.height + "px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
          </>
        )}
      </div>

      <div
        style={modalStyle}
        className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col"
      >
        <div className="p-4 sm:p-5 lg:p-6 overflow-y-auto flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 font-cormorant leading-tight">
            {currentStepData.title}
          </h2>
          <div className="space-y-2 sm:space-y-2.5 lg:space-y-3 mb-4 sm:mb-5 lg:mb-6">
            {currentStepData.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-xs sm:text-sm lg:text-base text-black/40 leading-relaxed font-inter"
              >
                {currentStep === 0 ? (
                  <>
                    <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-700 rounded-full mr-2 align-middle"></span>
                    {paragraph}
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs sm:text-sm text-[#4299CA] font-inter font-medium">
              {currentStep + 1}/{steps.length}
            </span>
            <button
              onClick={handleNext}
              className="bg-[#3D3D3D] hover:bg-[#2D2D2D] active:bg-[#1D1D1D] text-white px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all duration-200 font-inter flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 shadow-md hover:shadow-lg"
            >
              <span>
                {currentStep === steps.length - 1 ? "Let's go" : "Next"}
              </span>
              {currentStep < steps.length - 1 && (
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <DiagnosticDebriefModal
        isOpen={isDebriefModalOpen}
        onClose={() => setIsDebriefModalOpen(false)}
        onGetDebrief={handleGetDebrief}
      />
    </>
  );
};

export default GuidedWalkthrough;

