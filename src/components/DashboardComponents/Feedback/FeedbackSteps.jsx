import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  "I now understand better what empathy is as a leadership skill",
  "I now have resources, tools, and frameworks to develop my empathy as a leadership skill",
  "I now feel more confident about developing an empathetic leadership style",
  "I now plan to develop empathy as a skill in my career",
];

const FeedbackSteps = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem("feedbackCurrentStep");
    return saved ? Number(saved) : 0;
  });
  const [responses, setResponses] = useState(() => {
    const saved = sessionStorage.getItem("feedbackResponses");
    return saved ? JSON.parse(saved) : [3, 3, 3, 3];
  });
  const [showCompletionModal, setShowCompletionModal] = useState(() => {
    const saved = sessionStorage.getItem("feedbackShowCompletionModal");
    return saved ? JSON.parse(saved) : false;
  });

  // Save currentStep to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("feedbackCurrentStep", String(currentStep));
  }, [currentStep]);

  // Save responses to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("feedbackResponses", JSON.stringify(responses));
  }, [responses]);

  // Save completion modal state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("feedbackShowCompletionModal", JSON.stringify(showCompletionModal));
  }, [showCompletionModal]);

  const handleSliderChange = (value) => {
    const newResponses = [...responses];
    newResponses[currentStep] = value;
    setResponses(newResponses);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setShowCompletionModal(true);
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (showCompletionModal) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [showCompletionModal]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f5f5f5] rounded-2xl">
      <img
        src="/assets/images/dashboard/feedbacktop.webp"
        alt="dashboard top background"
        className="absolute top-0 left-0 lg:w-[613px] w-[350px] z-0 lg:h-[515px] h-[250px] object-cover object-top pointer-events-none"
      />
      <div className="relative z-20 h-full flex flex-col">
        <div className="relative px-4 lg:px-0 lg:py-6 py-4">
          <div className="flex items-center max-w-5xl mx-auto gap-2 sm:gap-3">
            <div className="relative flex items-center justify-between bg-[#f2f2f2] shadow-sm border border-[#ebebeb] rounded-xl sm:rounded-2xl px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 flex-1 min-w-0">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                  currentStep === 0
                    ? "bg-[#ebebeb] text-[#3D3D3D]/60 cursor-not-allowed"
                    : "bg-[#ebebeb] text-[#3D3D3D]/60 active:scale-95"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
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
                <span className="text-xs sm:text-sm md:text-base font-inter font-medium whitespace-nowrap hidden sm:inline">
                  Previous
                </span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 text-xs sm:text-sm md:text-base lg:text-lg text-[#3D3D3D]/80 font-inter font-medium whitespace-nowrap px-1">
                {currentStep + 1} of {questions.length}
              </div>
              <div className="flex items-center flex-shrink-0">
                {currentStep === questions.length - 1 ? (
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-inter font-medium text-xs sm:text-sm md:text-base shadow-sm whitespace-nowrap"
                  >
                    <span>Finish</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl bg-white text-[#3D3D3D] active:scale-95 transition-all font-inter font-medium text-xs sm:text-sm md:text-base shadow-sm whitespace-nowrap"
                  >
                    <span>Next</span>
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
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
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleExit}
              className="flex-shrink-0 border border-[#e6e6e6] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl bg-transparent text-[#3D3D3D] active:scale-95 transition-all font-inter font-medium text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Exit
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-12">
          <div className="w-full max-w-5xl">
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cormorant font-bold text-black text-center mb-10 sm:mb-16 md:mb-20 leading-tight px-4">
              {questions[currentStep]}
            </h2>
            <div className="relative px-4 lg:px-0 overflow-visible">
              <div className="relative p-2 bg-[#e3e3e3] rounded-full overflow-visible pl-[calc(0.5rem+1.5rem)] pr-[calc(0.5rem+1.5rem)] sm:pl-[calc(0.5rem+2.5rem)] sm:pr-[calc(0.5rem+2.5rem)] md:pl-[calc(0.5rem+3.5rem)] md:pr-[calc(0.5rem+3.5rem)]">
                <div className="absolute inset-0 flex items-center overflow-visible">
                  {[0, 1, 2, 3, 4, 5, 6].map((point) => {
                    const posPercent = (point / 6) * 100;
                    return (
                      <button
                        key={point}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleSliderChange(point);
                        }}
                        className="w-1.5 h-1.5 lg:w-2.5 lg:h-2.5 rounded-full bg-[#6664D3] z-50 cursor-pointer hover:scale-125 transition-transform flex items-center justify-center touch-manipulation relative"
                        style={{
                          position: "absolute",
                          left: `${posPercent}%`,
                          transform: "translateX(-50%)",
                          pointerEvents: "auto",
                        }}
                        aria-label={`Select value ${point}`}
                      />
                    );
                  })}
                </div>
                <div
                  className="absolute top-1/2 z-30 pointer-events-none transition-all duration-200"
                  style={{
                    left: `${(responses[currentStep] / 6) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    minWidth: "max-content",
                  }}
                >
                  <img
                    src="/assets/images/dashboard/Subtract.webp"
                    alt="slider handle"
                    className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain"
                    style={{ display: "block" }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={responses[currentStep]}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
              <div className="flex justify-between mt-8 sm:mt-12 md:mt-16 px-2">
                <span className="text-[9px] sm:text-sm md:text-base text-[#3D3D3D]/60 font-medium font-inter">
                  Strongly Disagree
                </span>
                <span className="text-[9px] sm:text-sm md:text-base text-[#3D3D3D]/60 font-medium font-inter">
                  Neutral
                </span>
                <span className="text-[9px] sm:text-sm md:text-base text-[#3D3D3D]/60 font-medium font-inter">
                  Strongly Agree
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/assets/images/dashboard/feedbackbottom.webp"
        alt="dashboard bottom background"
        className="absolute bottom-0 right-0 lg:w-[613px] w-[350px] z-0 lg:h-[515px] h-[250px] object-cover object-bottom pointer-events-none"
      />
      {showCompletionModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[299] backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 md:p-10 relative">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#6664D3] rounded-full flex items-center justify-center">
                  <img
                    src="/assets/images/dashboard/helpbtn.webp"
                    alt="action icon"
                    className="h-8 w-8 sm:h-12 sm:w-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-cormorant font-bold text-black text-center mb-4 sm:mb-6">
                Great work today!
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-black/50 text-center mb-6 sm:mb-8 md:mb-10 font-inter leading-relaxed">
                Our session is now concluded. Remember, I'm here whenever you
                need support on your leadership journey.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleGoToDashboard}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3  bg-[#3D3D3D]  text-[#F5F5F5] rounded-2xl font-inter font-medium text-sm sm:text-base md:text-lg transition-colors active:scale-95"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackSteps;
