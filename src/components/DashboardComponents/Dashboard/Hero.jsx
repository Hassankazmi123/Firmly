import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  API_AUTH_URL,
  authenticatedFetch,
  getUserProfile,
} from "../../../services/api";
import { useMainNavTransition } from "../../../context/MainNavTransitionContext";
import { assessmentService } from "../../../services/assessment";
import DiagnosticDebriefModal from "../AllModals/DiagnosticDebriefModal";
import RadarChart from "./RadarChart";
import { API_URL } from "../../../services/api";

const Hero = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mainNav = useMainNavTransition();
  const [currentMetric, setCurrentMetric] = useState(0);
  const [firstName, setFirstName] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.first_name || "";
      }
    } catch (e) {
      console.warn("Failed to parse user from localStorage:", e);
    }
    return "";
  });
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [debriefComplete, setDebriefComplete] = useState(() => {
    // Fallback so UI doesn't flicker while the server check loads.
    return localStorage.getItem("hasStartedDebrief") === "true";
  });

  const isFromAmalia = location.state?.fromAmaliaCorner || debriefComplete;
  const [overallScore, setOverallScore] = useState(null);
  const [scoreLabel, setScoreLabel] = useState("");
  const [radarData, setRadarData] = useState({
    GOAL: 70,
    RES: 65,
    EMP: 60,
    BELONG: 55,
    ENG: 50,
    SELF: 45,
  });
  const [peerData, setPeerData] = useState({
    GOAL: 60,
    RES: 55,
    EMP: 50,
    BELONG: 45,
    ENG: 40,
    SELF: 35,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        if (data && data.first_name) {
          setFirstName(data.first_name);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let assessmentId = localStorage.getItem("assessmentId");

        // If no ID is found (e.g., after login/cache clear), try to recover it from the server
        if (!assessmentId) {
          console.log("No assessmentId in cache, attempting to recover from server...");
          const resumeData = await assessmentService.startAssessment();
          // Extract ID from the resume/start response
          assessmentId = resumeData?.id || resumeData?.run_id || resumeData?.assessment_id || resumeData?.assessmentId ||
            resumeData?.assessment?.id || resumeData?.run?.id || resumeData?.data?.id ||
            localStorage.getItem("assessmentId"); // Fallback to cache since service saves it there
        }

        if (!assessmentId) {
          console.warn("Could not find or recover assessmentId.");
          return;
        }

        const data = await assessmentService.getResults(assessmentId);
        const domains = data?.domains || [];

        // Fetch overall score from the new API endpoint
        try {
          const overallData = await assessmentService.getOverallScore(assessmentId);
          if (overallData) {
            // Use the specific variable name overall_score_0_100 from the API
            const score = Math.round(overallData.overall_score_0_100 || overallData.overall_score || 0);
            setOverallScore(score);
            if (overallData.label) {
              setScoreLabel(overallData.label);
            } else {
              // Fallback label logic if API doesn't provide it
              if (score >= 75) setScoreLabel("Excellent");
              else if (score >= 50) setScoreLabel("Balanced");
              else if (score >= 30) setScoreLabel("Growing");
              else setScoreLabel("Developing");
            }
          }
        } catch (overallErr) {
          console.warn("Could not fetch overall score from dedicated API, falling back to calculation:", overallErr);
          if (domains.length > 0) {
            const avg = Math.round(
              domains.reduce(
                (acc, d) => acc + parseFloat(d.percent_0_100 || 0),
                0,
              ) / domains.length,
            );
            setOverallScore(avg);
            if (avg >= 75) setScoreLabel("Excellent");
            else if (avg >= 50) setScoreLabel("Balanced");
            else if (avg >= 30) setScoreLabel("Growing");
            else setScoreLabel("Developing");
          }
        }

        if (domains.length > 0) {
          // Map domain scores for radar chart
          const newRadarData = {};
          const newPeerData = {};
          domains.forEach((d) => {
            newRadarData[d.domain] = Math.round(
              parseFloat(d.percent_0_100 || 0),
            );
            newPeerData[d.domain] = Math.round(
              parseFloat(d.peer_mean_0_100 || 0),
            );
          });
          setRadarData((prev) => ({ ...prev, ...newRadarData }));
          setPeerData((prev) => ({ ...prev, ...newPeerData }));
        }
      } catch (err) {
        console.warn("Could not fetch assessment results:", err);
      }
    };

    fetchResults();
  }, []);

  // Fetch debrief completion flag so dashboard can show correct CTA text.
  useEffect(() => {
    let cancelled = false;

    const fetchDebriefFlag = async () => {
      try {
        let response = await authenticatedFetch(`${API_AUTH_URL}/debrief/`, {
          method: "GET",
          returnRawResponse: true
        });

        if (response.status === 404) {
          response = await authenticatedFetch(`${API_AUTH_URL}/debrief`, {
            method: "GET",
            returnRawResponse: true
          });
        }

        if (response.ok) {
          const data = await response.json();
          if (data && data.debrief_complete === true) {
            setDebriefComplete(true);
            localStorage.setItem("hasStartedDebrief", "true");
          }
        }
      } catch (err) {
        console.warn("Debrief completion API failed:", err);
        // Fallback: if we have local storage flag, use it
        if (localStorage.getItem("hasStartedDebrief") === "true") {
          setDebriefComplete(true);
        }
      }
    };

    fetchDebriefFlag();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-open debrief modal after 30 seconds (only if not completed server-side).
  useEffect(() => {
    const timerId = setTimeout(() => {
      const hasShownAuto = sessionStorage.getItem("debrief_auto_shown");
      if (!hasShownAuto && !debriefComplete) {
        setIsDebriefModalOpen(true);
        sessionStorage.setItem("debrief_auto_shown", "true");
      }
    }, 30000);

    return () => clearTimeout(timerId);
  }, [debriefComplete]);

  const metrics = [
    {
      name: "Goal Orientation",
      description:
        "The tendency to set goals and make plans. People with high levels of goal orientation tend to think about their goals in advance.",
    },
    {
      name: "Resilience",
      description:
        "The capacity to recover quickly from difficulties. Resilient individuals adapt well to adversity and maintain their stress.",
    },
    {
      name: "Empathy",
      description:
        "The ability to understand and share the feelings of others. Empathetic individuals build stronger relationships and create.",
    },
    {
      name: "Workplace Belonging",
      description:
        "The sense of being accepted and valued in the workplace. High belonging leads to increased engagement and retention.",
    },
    {
      name: "Engagement",
      description:
        "The level of involvement and enthusiasm in work. Engaged employees are more productive and contribute positively goals.",
    },
    {
      name: "Self-Belief",
      description:
        "Confidence in one's own abilities and judgment. People with high self-belief trust their capabilities and make conviction.",
    },
  ];

  const nextMetric = () =>
    setCurrentMetric((prev) => (prev + 1) % metrics.length);
  const prevMetric = () =>
    setCurrentMetric((prev) => (prev - 1 + metrics.length) % metrics.length);

  return (
    <>
      <section className="relative lg:py-8 py-4 overflow-visible">
        <div className="text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white font-cormorant">
            Welcome, {firstName}
          </h1>
          <p className="text-base lg:text-lg text-white/70 mb-4  font-inter max-w-2xl ">
            This visual summary displays your scores across six research-backed
            metrics.
          </p>
        </div>
        <div className="relative mt-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center lg:mt-0 mt-5">
            <div data-tour="radar-chart">
              <div className="flex items-center gap-6 text-white text-xs mb-6">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-[#FFCD4F] rounded-full mr-2 shadow-[0_0_8px_rgba(255,205,79,0.8)]"></span>
                  Today
                </div>
              </div>
              <div className="flex items-center justify-center lg:h-[450px] h-[350px]">
                <RadarChart
                  data={radarData}
                  peerData={peerData}
                  highlightIndex={currentMetric}
                  onMetricClick={setCurrentMetric}
                />
              </div>
            </div>

            <div className="space-y-4" data-tour="overall-score">
              <div className="bg-[#7d7cd9] border border-white/20  rounded-2xl lg:px-5 lg:py-4 px-4 py-4">
                <p className="text-white/70 text-sm lg:text-base font-inter">
                  Your overall score
                </p>
                <div className="flex items-center justify-between ">
                  <h2 className="text-2xl sm:text-4xl font-bold text-white font-cormorant">
                    {overallScore !== null ? (
                      scoreLabel
                    ) : (
                      <span className="inline-block w-24 h-8 bg-white/20 rounded-lg animate-pulse" />
                    )}
                  </h2>
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white font-times-new-roman ">
                      {overallScore !== null ? (
                        overallScore
                      ) : (
                        <span className="inline-block w-16 h-14 bg-white/20 rounded-lg animate-pulse" />
                      )}
                    </span>
                    <span className="text-xl sm:text-3xl text-white/40 ml-2 font-times-new-roman">
                      /100
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#7d7cd9] border border-white/20  rounded-2xl lg:px-5 lg:py-4 px-4 py-4 relative z-30">
                <div className="flex  lg:flex-row flex-col justify-between">
                  <p className="text-white/70 text-sm lg:text-base mb-4 lg:mb-0 font-inter">
                    Understanding your metrics
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (debriefComplete) {
                        const path = "/amalia-corner";
                        const state = { showResults: true };
                        if (mainNav?.navigateMainView) {
                          mainNav.navigateMainView(path, { state });
                        } else {
                          navigate(path, { state });
                        }
                      } else {
                        setIsDebriefModalOpen(true);
                        sessionStorage.setItem("debrief_auto_shown", "true");
                      }
                    }}
                    className=" bg-white  font-medium py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors mb-4 hover:bg-white/90 active:scale-95"
                  >
                    <img
                      src="/assets/images/dashboard/starpurple.webp"
                      alt="star icon"
                      className="h-5 w-5"
                    />
                    <span className="text-[#6664D3]">
                      {debriefComplete ? "Amalia Debrief" : "Start Debrief"}
                    </span>
                  </button>
                </div>
                <div className="flex items-end justify-between mb-4">
                  <div className="max-w-md">
                    <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 font-cormorant">
                      {metrics[currentMetric].name}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 font-inter">
                      {metrics[currentMetric].description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-6xl font-bold text-white font-times-new-roman">
                        {radarData[
                          ["GOAL", "RES", "EMP", "BELONG", "ENG", "SELF"][
                          currentMetric
                          ]
                        ] || 0}
                      </span>
                      <span className="text-xl sm:text-2xl text-white/40 ml-1 font-times-new-roman">
                        /100
                      </span>
                    </div>
                    <p className="text-white/50 text-xs sm:text-sm font-inter">
                      Domain Score
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 relative z-40">
                  <button
                    onClick={prevMetric}
                    type="button"
                    className="w-10 h-10 rounded-xl bg-transparent border border-white/20 text-white flex items-center justify-center transition-colors active:bg-white/10 relative z-40 cursor-pointer"
                    aria-label="Previous metric"
                  >
                    <svg
                      className="w-5 h-5 pointer-events-none"
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
                  </button>
                  <button
                    onClick={nextMetric}
                    type="button"
                    className="w-10 h-10 rounded-xl bg-transparent border border-white/20 text-white flex items-center justify-center transition-colors active:bg-white/10 relative z-40 cursor-pointer"
                    aria-label="Next metric"
                  >
                    <svg
                      className="w-5 h-5 pointer-events-none"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <DiagnosticDebriefModal
        isOpen={isDebriefModalOpen}
        onClose={() => setIsDebriefModalOpen(false)}
        onGetDebrief={() => {
          setDebriefComplete(true);
          setIsDebriefModalOpen(false);
        }}
      />
    </>
  );
};
export default Hero;
