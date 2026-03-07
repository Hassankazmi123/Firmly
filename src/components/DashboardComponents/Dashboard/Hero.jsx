import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getUserProfile } from "../../../services/api";
import { assessmentService } from "../../../services/assessment";
import DebriefResultsModal from "../AllModals/DebriefResultsModal";

const Hero = () => {
  const location = useLocation();
  const isFromAmalia = location.state?.fromAmaliaCorner || sessionStorage.getItem("hasVisitedAmaliaCorner") === "true";
  const [currentMetric, setCurrentMetric] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false);
  const [overallScore, setOverallScore] = useState(null);
  const [scoreLabel, setScoreLabel] = useState("");

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
    const fetchScore = async () => {
      try {
        const assessmentId = localStorage.getItem("assessmentId");
        if (!assessmentId) return;
        const data = await assessmentService.getResults(assessmentId);
        const domains = data?.domains || [];
        if (domains.length > 0) {
          const avg = Math.round(
            domains.reduce((acc, d) => acc + parseFloat(d.percent_0_100 || 0), 0) / domains.length
          );
          setOverallScore(avg);
          if (avg >= 75) setScoreLabel("Excellent");
          else if (avg >= 50) setScoreLabel("Balanced");
          else if (avg >= 30) setScoreLabel("Growing");
          else setScoreLabel("Developing");
        }
      } catch (err) {
        console.warn("Could not fetch overall score:", err);
      }
    };
    fetchScore();
  }, []);

  const metrics = [
    {
      name: "Goal Orientation",
      description:
        "The tendency to set goals and make plans. People with high levels of goal orientation tend to think about their goals in advance.",
    },
    {
      name: "Self-Belief",
      description:
        "Confidence in one's own abilities and judgment. People with high self-belief trust their capabilities and make conviction.",
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
            metrics that impact women's workplace effectiveness and leadership
            potential.
          </p>
        </div>
        <div className="relative mt-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center lg:mt-0 mt-5">
            <div data-tour="radar-chart">
              <div className="flex items-center text-white text-sm ">
                <span className="w-2 h-2 bg-[#FFCD4F] rounded-full mr-2"></span>
                Today
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/assets/images/dashboard/poly.webp"
                  alt="star icon"
                  className="lg:h-[350px] lg:w-[430px] h-full w-full"
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
                    {overallScore !== null ? scoreLabel : (
                      <span className="inline-block w-24 h-8 bg-white/20 rounded-lg animate-pulse" />
                    )}
                  </h2>
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-6xl lg:text-7xl font-bold text-white font-times-new-roman ">
                      {overallScore !== null ? overallScore : (
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
                    onClick={() => setIsDebriefModalOpen(true)}
                    className=" bg-white  font-medium py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors mb-4 hover:bg-white/90 active:scale-95"
                  >
                    <img
                      src="/assets/images/dashboard/starpurple.webp"
                      alt="star icon"
                      className="h-5 w-5"
                    />
                    <span className="text-[#6664D3]">{isFromAmalia ? "Amalia Debrief" : "Start a Debrief"}</span>
                  </button>
                </div>
                <div className="max-w-md">
                  <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 font-cormorant">
                    {metrics[currentMetric].name}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 font-inter">
                    {metrics[currentMetric].description}
                  </p>
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
      <DebriefResultsModal
        isOpen={isDebriefModalOpen}
        onClose={() => setIsDebriefModalOpen(false)}
      />
    </>
  );
};
export default Hero;
