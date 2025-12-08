import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  "I tend to think about what I'll be doing a year from now.",
  "I frequently plan for the future.",
  "I frequently think about my job or career goals.",
  "When I have an important goal, I develop a plan to achieve it.",
  "I take the time to make a plan to help me reach my goals.",
  "I struggle to move on from setbacks at works.",
  "I generally figure out a way to manage challenges at work.",
  "I can handle tough times at work because I've dealt with challenges in the past.",
  "I usually bounce back quickly from difficult situations at work.",
  "I usually manage tough times at work without much difficulty.",
  "I tend to take a while to recover from setbacks at work.",
  "Before criticizing someone at work, I make an effort to consider how I would experience the situation from their perspective.",
  "I don't spend much time listening to opposing views as work if I am confident that I'm right about somethings. (reverse scoring)",
  "I believe there are always multiple perspectives to consider at work and strive to see every side of an issue",
  "I make an effort o understand everyone's point of view in a disagreement at work before making a decision.",
  " I sometimes feel like I fit in at work, and other times I don't.",
  "When something negative occurs at work, I question if I truly belong.",
  "When something positive happens at work, I feel a strong sense of belonging. (reverse scoring)",
  "There is alignment between my works and my personal values, beliefs, and behaviors.",
  "I derive a sense of meaning or purpose from my work.",
  "My work contributes to my sense of personal mission in life.",
  "I know I can achieve most of the work goals I set for myself.",
  "I think I can achieve outcomes that are important to me.",
  "I believe I can succeed in anything I set my mind to.",
  "I am confident in my ability to perform task at work effectively.",
  "I am capable of doing most tasks very well compared to others.",
];

const DiagnosticSteps = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([3, 3, 3, 3]);

  // Color scheme function based on current step
  const getColorScheme = (step) => {
    if (step < 5) {
      return {
        background: "#378c78",
        button: "#479583",
        slider: "#579e8e",
        text: "#378c78",
      };
    } else if (step >= 5 && step <= 10) {
      return {
        background: "#4299ca",
        button: "#51a1ce",
        slider: "#60a9d3",
        text: "#4299ca",
      };
    } else if (step >= 11 && step <= 14) {
      return {
        background: "#855cc9",
        button: "#8f69cd",
        slider: "#9976d2",
        text: "#855cc9",
      };
    } else if (step >= 15 && step <= 17) {
      return {
        background: "#cc66a9",
        button: "#d072b0",
        slider: "#d47fb7",
        text: "#cc66a9",
      };
    } else if (step >= 18 && step <= 20) {
      return {
        background: "#c56a55",
        button: "#ca7662",
        slider: "#ce8270",
        text: "#c56a55",
      };
    } else if (step >= 21 && step <= 25) {
      return {
        background: "#4299ca",
        button: "#51a1ce",
        slider: "#60a9d3",
        text: "#4299ca",
      };
    } else {
      return {
        background: "#7a7a7a",
        button: "#8c8c8c",
        slider: "#9c9c9c",
        text: "#7a7a7a",
      };
    }
  };

  const colors = getColorScheme(currentStep);

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
    // Navigate to the Diagnostic component in "completed" mode
    navigate("/diagnostic/completed");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  // No local completion modal — Finish navigates to Diagnostic completed view

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: colors.background }}
    >
      <img
        src="/assets/images/dashboard/feedbacktop.webp"
        alt="dashboard top background"
        className="absolute top-0 left-0 w-[250px] sm:w-[350px] lg:w-[613px] z-0 h-[180px] sm:h-[250px] lg:h-[515px] object-cover object-top pointer-events-none"
      />
      <div className="relative z-20 h-full flex flex-col">
        <div className="relative px-3 sm:px-4 lg:px-0 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center max-w-5xl mx-auto gap-2 sm:gap-3">
            <div
              className="relative flex items-center justify-between shadow-sm border border-[#ebebeb] rounded-xl sm:rounded-2xl px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 flex-1 min-w-0 overflow-hidden"
              style={{ background: colors.button }}
            >
              {/* Background Progress Bar */}
              <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl">
                <div
                  className="h-full bg-white/20 transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`relative z-10 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ${
                  currentStep === 0
                    ? "bg-[#ebebeb] text-[#3D3D3D]/60 cursor-not-allowed"
                    : "bg-[#ebebeb] text-[#3D3D3D]/60 active:scale-95"
                }`}
                style={{
                  color:
                    currentStep === 0 ? "rgba(61, 61, 61, 0.6)" : colors.text,
                }}
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

              <div className="relative z-10 text-xs sm:text-sm md:text-base lg:text-lg text-[#FFF]/80 font-inter font-medium whitespace-nowrap px-1">
                {currentStep + 1} of {questions.length}
              </div>

              <div className="relative z-10 flex items-center flex-shrink-0">
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
                    style={{ color: colors.text }}
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
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-12 pb-6 sm:pb-8 md:pb-12">
          <div className="w-full max-w-5xl">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-cormorant font-bold text-white text-center mb-6 sm:mb-10 md:mb-16 lg:mb-20 leading-tight px-2 sm:px-4">
              {questions[currentStep]}
            </h2>
            <div className="relative px-2 sm:px-4 lg:px-0 overflow-visible">
              <div
                className="relative p-1.5 sm:p-2 bg-[#e3e3e3] rounded-full overflow-visible pl-[calc(0.25rem+1rem)] pr-[calc(0.25rem+1rem)] sm:pl-[calc(0.5rem+1.5rem)] sm:pr-[calc(0.5rem+1.5rem)] md:pl-[calc(0.5rem+2.5rem)] md:pr-[calc(0.5rem+2.5rem)] lg:pl-[calc(0.5rem+3.5rem)] lg:pr-[calc(0.5rem+3.5rem)]"
                style={{ background: colors.slider }}
              >
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
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#FFF] z-50 cursor-pointer hover:scale-125 active:scale-150 transition-transform flex items-center justify-center touch-manipulation relative"
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
                    className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 object-contain"
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
              <div className="flex justify-between mt-4 sm:mt-6 md:mt-10 lg:mt-16 px-1 sm:px-2">
                <span className="text-[8px] sm:text-xs md:text-sm lg:text-base text-[#FFF]/60 font-medium font-inter leading-tight text-center max-w-[80px] sm:max-w-none">
                  Strongly Disagree
                </span>
                <span className="text-[8px] sm:text-xs md:text-sm lg:text-base text-[#FFF]/60 font-medium font-inter">
                  Neutral
                </span>
                <span className="text-[8px] sm:text-xs md:text-sm lg:text-base text-[#FFF]/60 font-medium font-inter leading-tight text-center max-w-[80px] sm:max-w-none">
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
        className="absolute bottom-0 right-0 w-[250px] sm:w-[350px] lg:w-[613px] z-0 h-[180px] sm:h-[250px] lg:h-[515px] object-cover object-bottom pointer-events-none"
      />
    </div>
  );
};

export default DiagnosticSteps;
