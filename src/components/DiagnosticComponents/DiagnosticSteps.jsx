import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { assessmentService } from "../../services/assessment";

const DiagnosticSteps = () => {
  const navigate = useNavigate();
  // State for assessment flow
  const [runId, setRunId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0); // If available
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // For progress bar/counter

  const [currentResponse, setCurrentResponse] = useState(3);

  const [history, setHistory] = useState([]);

  const highlightRun = useRef(false);

  useEffect(() => {
    const initAssessment = async () => {
      if (highlightRun.current) return;
      highlightRun.current = true;

      try {
        setIsLoading(true);
        const startData = await assessmentService.startAssessment("v1");
        const rId =
          startData?.id ||
          startData?.run_id ||
          startData?.assessment_id ||
          startData?.assessmentId;
        if (!rId) {
          throw new Error("Assessment run id missing from start response.");
        }
        localStorage.setItem("assessmentId", String(rId));
        setRunId(rId);

        if (startData.questions && Array.isArray(startData.questions)) {
          setTotalQuestions(startData.questions.length);
        }

        const nextQ = await assessmentService.getNextQuestion(rId);

        console.log("Next Question Received:", nextQ);

        if (nextQ) {
          setCurrentQuestion(nextQ);

          try {
            const progressData = await assessmentService.getProgress(rId);
            if (progressData && typeof progressData.answered_count === 'number') {
              setCurrentStepIndex(progressData.answered_count);
            }
          } catch (ignore) {
            console.warn("Could not fetch progress", ignore);
          }
        } else {
          localStorage.removeItem("diagnosticStep");
          localStorage.removeItem("diagnosticHistory");
          localStorage.removeItem("assessmentId");
          navigate("/diagnostic/completed", { state: { runId: rId } });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize assessment:", err);
        setError(err.message || "Failed to load assessment. Please try again.");
        setIsLoading(false);
      }
    };

    initAssessment();
  }, [navigate]);

  if (error) {
    const isAuthError = error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("log in");
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#ebebeb]">
        <div className="text-center px-6 py-8 bg-white rounded-2xl shadow-lg max-w-sm mx-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-cormorant">Error Occurred</h3>
          <p className="text-gray-600 mb-6 font-inter text-sm">{error}</p>
          {isAuthError ? (
            <button
              onClick={() => navigate("/onboarding")}
              className="bg-[#222] text-white px-6 py-2.5 rounded-full font-medium active:scale-95 transition-all w-full"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="bg-[#222] text-white px-6 py-2.5 rounded-full font-medium active:scale-95 transition-all w-full"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const getColorScheme = (step) => {

    if (step < 5) {
      return {
        background: "#378c78", // Green
        button: "#479583",
        slider: "#579e8e",
        text: "#378c78",
      };
    } else if (step >= 5 && step <= 10) {
      return {
        background: "#4299ca", // Blue
        button: "#51a1ce",
        slider: "#60a9d3",
        text: "#4299ca",
      };
    } else if (step >= 11 && step <= 14) {
      return {
        background: "#855cc9", // Purple
        button: "#8f69cd",
        slider: "#9976d2",
        text: "#855cc9",
      };
    } else if (step >= 15 && step <= 17) {
      return {
        background: "#cc66a9", // Pink
        button: "#d072b0",
        slider: "#d47fb7",
        text: "#cc66a9",
      };
    } else if (step >= 18 && step <= 20) {
      return {
        background: "#c56a55", // Orange
        button: "#ca7662",
        slider: "#ce8270",
        text: "#c56a55",
      };
    } else {
      // Remaining questions (21-25), including Q26
      // Explicitly using the requested Blue schemes
      return {
        background: "#4299ca",
        button: "#51a1ce",
        slider: "#60a9d3",
        text: "#4299ca",
      };
    }
  };

  const colors = getColorScheme(currentStepIndex);

  const handleSliderChange = (value) => {
    setCurrentResponse(value);
  };

  const handlePrevious = () => {
    // Check if we have history to go back to
    if (history.length > 0) {
      const prev = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      setHistory(newHistory);
      setCurrentQuestion(prev.question);
      setCurrentResponse(prev.response);
      setCurrentStepIndex(prev.stepIndex);
    }
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    // Save to history before moving on
    const historyItem = {
      question: currentQuestion,
      response: currentResponse,
      stepIndex: currentStepIndex
    };

    try {
      setIsLoading(true);

      const qId = currentQuestion.id || currentQuestion.question_id || currentQuestion.pk;
      if (!qId) {
        throw new Error("Invalid question data: Missing ID");
      }

      // Submit answer (backend expects 1-7 range, UI is 0-6)
      const rawVal = currentResponse;
      const safeVal = (typeof rawVal === 'number' && !isNaN(rawVal)) ? rawVal : 3;
      const finalChoice = safeVal + 1;

      console.log("Processing Answer:", { rawVal, safeVal, finalChoice });

      await assessmentService.submitAnswer(runId, qId, finalChoice);

      // Add to history now that it's submitted (or optimistically)
      setHistory([...history, historyItem]);

      // Optimize: If we know this is the last question, skip validation fetch to avoid 410 errors
      // currentStepIndex is 0-based. If we are at 25 (26th Q) and total is 26, we are done.
      const maxQuestions = totalQuestions || 26;
      if (currentStepIndex >= maxQuestions - 1) {
        localStorage.removeItem("diagnosticStep");
        localStorage.removeItem("diagnosticHistory");
        localStorage.removeItem("assessmentId");
        localStorage.removeItem("diagnosticQuestion");
        localStorage.removeItem("diagnosticTotalQuestions");
        navigate("/diagnostic/completed", { state: { runId } });
        setIsLoading(false);
        return;
      }

      // Fetch next
      let nextQ = null;
      try {
        nextQ = await assessmentService.getNextQuestion(runId);
        console.log("Next Question Received:", nextQ);
      } catch (fetchErr) {
        console.warn("Failed to fetch next question. Assuming assessment complete.", fetchErr);
        nextQ = null;
      }

      // Validating nextQ structure to ensure it's a real question
      // Sometimes backend might return a success message object 
      if (nextQ && (nextQ.id || nextQ.question_id || nextQ.pk)) {
        setCurrentQuestion(nextQ);
        setCurrentResponse(3); // Reset to neutral for new question
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Finished if nextQ is null OR if it doesn't look like a question
        localStorage.removeItem("diagnosticStep");
        localStorage.removeItem("diagnosticHistory");
        localStorage.removeItem("assessmentId");
        localStorage.removeItem("diagnosticQuestion");
        localStorage.removeItem("diagnosticTotalQuestions");
        navigate("/diagnostic/completed", { state: { runId } });
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Error submitting answer:", err);
      // Detailed logging for debugging
      console.log("Failed Payload:", { runId, questionId: currentQuestion?.id, response: currentResponse });

      setError(err.message || "Failed to submit answer. Please try again.");
      setIsLoading(false);
    }
  };



  if (isLoading && !currentQuestion) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-inter">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4 font-inter">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Hardcoded corrected questions to override API text
  const CORRECTED_QUESTIONS = [
    "I tend to think about what I'll be doing a year from now.",
    "I frequently plan for the future.",
    "I frequently think about my job or career goals.",
    "When I have an important goal, I develop a plan to achieve it.",
    "I take the time to make a plan to help me reach my goals.",
    "I struggle to move on from setbacks at work.",
    "I generally figure out a way to manage challenges at work.",
    "I can handle tough times at work because I've dealt with challenges in the past.",
    "I usually bounce back quickly from difficult situations at work.",
    "I usually manage tough times at work without much difficulty.",
    "I tend to take a while to recover from setbacks at work.",
    "Before criticizing someone at work, I make an effort to consider how I would experience the situation from their perspective.",
    "I don't spend much time listening to opposing views at work if I am confident that I'm right about something.",
    "I believe there are always multiple perspectives to consider at work and strive to see every side of an issue.",
    "I make an effort to understand everyone's point of view in a disagreement at work before making a decision.",
    "I sometimes feel like I fit in at work, and other times I don't.",
    "When something negative occurs at work, I question if I truly belong.",
    "When something positive happens at work, I feel a strong sense of belonging.",
    "There is alignment between my work and my personal values, beliefs, and behaviors.",
    "I derive a sense of meaning or purpose from my work.",
    "My work contributes to my sense of personal mission in life.",
    "I know I can achieve most of the work goals I set for myself.",
    "I think I can achieve outcomes that are important to me.",
    "I believe I can succeed in anything I set my mind to.",
    "I am confident in my ability to perform tasks at work effectively.",
    "I am capable of doing most tasks very well compared to others."
  ];

  // Fallback if no question yet
  if (!currentQuestion) return null;

  // Use local corrected text if available, otherwise fallback to API text
  const questionText = CORRECTED_QUESTIONS[currentStepIndex] || currentQuestion.text || currentQuestion.content || currentQuestion.question || "Question text missing";

  // Calculate progress %
  // If totalQuestions is known (e.g. 26), use it. Else estimate or show just step count.
  const totalSteps = totalQuestions || 26;
  const progressPercent = Math.min(((currentStepIndex + 1) / totalSteps) * 100, 100);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: colors.background }}
    >
      <img
        src="/assets/images/dashboard/feedbacktop.webp"
        alt="dashboard top background"
        className="absolute top-0 left-0 w-[200px] sm:w-[280px] lg:w-[490px] z-0 h-[144px] sm:h-[200px] lg:h-[412px] object-cover object-top pointer-events-none"
      />
      <div className="relative z-20 h-full flex flex-col">
        <div className="relative px-3 sm:px-4 lg:px-0 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center max-w-4xl mx-auto gap-2 sm:gap-3">
            <div
              className="relative flex items-center justify-between shadow-sm border border-[#ebebeb] rounded-xl sm:rounded-2xl px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 flex-1 min-w-0 overflow-hidden"
              style={{ background: colors.button }}
            >
              {/* Background Progress Bar */}
              <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl">
                <div
                  className="h-full bg-white/20 transition-all duration-300 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>

              {history.length > 0 ? (
                <button
                  onClick={handlePrevious}
                  className="relative z-10 flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl transition-all flex-shrink-0 bg-[#ebebeb] text-[#3D3D3D]/60 active:scale-95"
                  style={{ color: colors.text }}
                >
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0"
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
                  <span className="text-[10px] sm:text-xs md:text-sm font-inter font-medium whitespace-nowrap hidden sm:inline">
                    Previous
                  </span>
                </button>
              ) : (
                <div className="flex-shrink-0"></div>
              )}

              <div className="relative z-10 text-[10px] sm:text-xs md:text-sm lg:text-base text-[#FFF]/80 font-inter font-medium whitespace-nowrap px-1">
                {currentStepIndex + 1} of {Math.max(totalQuestions, currentStepIndex + 1)}
              </div>

              <div className="relative z-10 flex items-center flex-shrink-0">
                {/* We don't know exact end unless totalQuestions is accurate. 
                    If we are at last step, button might say Finish. 
                    Optimistically show Next unless we are sure. */}
                {(currentStepIndex >= totalSteps - 1) ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl bg-white text-gray-700 hover:bg-gray-50 active:scale-95 transition-all font-inter font-medium text-[10px] sm:text-xs md:text-sm shadow-sm whitespace-nowrap"
                  >
                    <span>Submit</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl bg-white text-[#3D3D3D] active:scale-95 transition-all font-inter font-medium text-[10px] sm:text-xs md:text-sm shadow-sm whitespace-nowrap"
                    style={{ color: colors.text }}
                  >
                    <span>Next</span>
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0"
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
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4 md:px-5 lg:px-10 pb-4 sm:pb-6 md:pb-10">
          <div className="w-full max-w-4xl">
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-cormorant font-bold text-white text-center mb-4 sm:mb-6 md:mb-10 lg:mb-14 leading-tight px-2 sm:px-4">
              {questionText}
            </h2>
            <div className="relative px-2 sm:px-4 lg:px-0 overflow-visible">
              <div
                className="relative p-1 sm:p-1.5 bg-[#e3e3e3] rounded-full overflow-visible pl-[calc(0.25rem+0.8rem)] pr-[calc(0.25rem+0.8rem)] sm:pl-[calc(0.5rem+1.2rem)] sm:pr-[calc(0.5rem+1.2rem)] md:pl-[calc(0.5rem+2rem)] md:pr-[calc(0.5rem+2rem)] lg:pl-[calc(0.5rem+2.8rem)] lg:pr-[calc(0.5rem+2.8rem)]"
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
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#FFF] z-50 cursor-pointer hover:scale-125 active:scale-150 transition-transform flex items-center justify-center touch-manipulation relative"
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
                    left: `${(currentResponse / 6) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    minWidth: "max-content",
                  }}
                >
                  <img
                    src="/assets/images/dashboard/Subtract.webp"
                    alt="slider handle"
                    className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                    style={{ display: "block" }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={currentResponse}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
              <div className="flex justify-between mt-3 sm:mt-4 md:mt-6 lg:mt-10 px-1 sm:px-2">
                <span className="text-[7px] sm:text-[10px] md:text-xs lg:text-sm text-[#FFF]/60 font-medium font-inter leading-tight text-center max-w-[80px] sm:max-w-none">
                  Strongly Disagree
                </span>
                <span className="text-[7px] sm:text-[10px] md:text-xs lg:text-sm text-[#FFF]/60 font-medium font-inter">
                  Neutral
                </span>
                <span className="text-[7px] sm:text-[10px] md:text-xs lg:text-sm text-[#FFF]/60 font-medium font-inter leading-tight text-center max-w-[80px] sm:max-w-none">
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
        className="absolute bottom-0 right-0 w-[200px] sm:w-[280px] lg:w-[490px] z-0 h-[144px] sm:h-[200px] lg:h-[412px] object-cover object-bottom pointer-events-none"
      />
    </div>
  );
};

export default DiagnosticSteps;