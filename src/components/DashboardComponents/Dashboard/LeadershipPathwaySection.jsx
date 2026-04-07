import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Lock, Check } from "lucide-react";
import LeadershipPathwayModal from "../AllModals/LeadershipPathwayModal";
import SessionModal from "../AllModals/SessionModal";
import Session2Modal from "../AllModals/Session2Modal";
import Session3Modal from "../AllModals/Session3Modal";
import Session4Modal from "../AllModals/Session4Modal";
import { pathwayService } from "../../../services/pathway";

const LeadershipPathwaySection = ({
  hasVisitedAmaliaCorner = false,
  onGenerated,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSession2ModalOpen, setIsSession2ModalOpen] = useState(false);
  const [isSession3ModalOpen, setIsSession3ModalOpen] = useState(false);
  const [isSession4ModalOpen, setIsSession4ModalOpen] = useState(false);
  const [isPathwayGenerated, setIsPathwayGenerated] = useState(() => {
    return localStorage.getItem("hasGeneratedPathway") === "true";
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const [showPathwayDesign, setShowPathwayDesign] = useState(() => {
    return localStorage.getItem("hasGeneratedPathway") === "true";
  });

  // Read persisted completed sessions from localStorage (saved by AmaliaCornerLayout)
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("amalia_completed_sessions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const recoverPathwayState = async () => {
      try {
        // 0. Check for session summary from login sync
        const summaryStr = localStorage.getItem("session_history_summary");
        if (summaryStr) {
          const summary = JSON.parse(summaryStr);
          if (summary.anyStarted) {
            console.log("Restoring pathway state from sync summary...");
            setIsPathwayGenerated(true);
            setShowPathwayDesign(true);
            localStorage.setItem("hasGeneratedPathway", "true");
            localStorage.setItem("hasStartedSessions", "true");
            
            // Derive completed sessions from summary for current domain
            const currentDomain = sessionStorage.getItem("currentPathwayDomain")?.toLowerCase();
            const domainKey = Object.keys(summary.sessions).find(d => 
              currentDomain?.includes(d) || d.includes(currentDomain || "")
            ) || "emp";
            
            const domainSessions = summary.sessions[domainKey] || {};
            const done = [];
            Object.keys(domainSessions).forEach(stepId => {
              if (domainSessions[stepId] === "COMPLETED") {
                done.push(parseInt(stepId));
              }
            });
            if (done.length > 0) {
              setCompletedSessions(done);
              localStorage.setItem("amalia_completed_sessions", JSON.stringify(done));
            }
            return; // Summary used, skip other recovery steps
          }
        }

        // 1. Check if pathway exists by looking for session info
        const nextSessionInfo = await pathwayService.getNextSessionInfo();
        
        if (nextSessionInfo && (nextSessionInfo.next_session_number || nextSessionInfo.nextSessionNumber)) {
          console.log("Restoring pathway sessions from server...");
          
          localStorage.setItem("hasGeneratedPathway", "true");
          localStorage.setItem("hasStartedSessions", "true");
          setIsPathwayGenerated(true);
          setShowPathwayDesign(true);

          if (nextSessionInfo.domain) {
            sessionStorage.setItem("currentPathwayDomain", nextSessionInfo.domain);
          }

          // Recover completed sessions
          const nextNum = parseInt(nextSessionInfo.next_session_number || nextSessionInfo.nextSessionNumber);
          if (!isNaN(nextNum)) {
            const done = [];
            for (let i = 1; i < nextNum; i++) {
              done.push(i);
            }
            if (done.length > 0) {
              setCompletedSessions(done);
              localStorage.setItem("amalia_completed_sessions", JSON.stringify(done));
            }
          }
        } else {
          // If no session info found, fallback to checking if a pathway technicaly exists 
          // (used for identifying new vs returning users who haven't started sessions)
          const response = await pathwayService.startPathway();
          if (response && response.statusCode === 409) {
             // Status 409 (Conflict) means it was already generated before!
             setShowPathwayDesign(true);
             setIsPathwayGenerated(true);
             localStorage.setItem("hasGeneratedPathway", "true");
          }
        }
      } catch (err) {
        console.error("Failed to recover pathway state:", err);
      }
    };

    const hasGeneratedLocal = localStorage.getItem("hasGeneratedPathway") === "true";
    if (!hasGeneratedLocal && hasVisitedAmaliaCorner) {
      recoverPathwayState();
    } else if (hasGeneratedLocal) {
      setShowPathwayDesign(true);
      setIsPathwayGenerated(true);
    }

    // Re-read completedSessions on mount in case they were updated
    try {
      const saved = localStorage.getItem("amalia_completed_sessions");
      if (saved) setCompletedSessions(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, [hasVisitedAmaliaCorner]);

  // Auto-open Leadership Pathway modal after 20 seconds if Grow & Glow is filled but Pathway is not yet showing
  useEffect(() => {
    if (hasVisitedAmaliaCorner && !showPathwayDesign) {
      const timerId = setTimeout(() => {
        const autoShown = sessionStorage.getItem("pathway_auto_prompted");
        if (!autoShown) {
          console.log("Auto-prompting Leadership Pathway generation");
          setIsModalOpen(true);
          sessionStorage.setItem("pathway_auto_prompted", "true");
        }
      }, 20000); // 20 seconds as requested
      return () => clearTimeout(timerId);
    }
  }, [hasVisitedAmaliaCorner, showPathwayDesign]);

  // Derive per-session state from completedSessions
  const session1Done = completedSessions.includes(1);
  const session2Done = completedSessions.includes(2);
  const session3Done = completedSessions.includes(3);
  const session4Done = completedSessions.includes(4);

  const handleManualGenerate = async () => {
    // Manual click generates directly on the dashboard
    handleGenerate();
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    console.log("Generate Leadership Pathway clicked");
    setIsGenerating(true);
    try {
      const response = await pathwayService.startPathway();
      if (response && response.domain) {
        sessionStorage.setItem("currentPathwayDomain", response.domain);
      }
      localStorage.setItem("hasGeneratedPathway", "true");
      localStorage.setItem("hasStartedSessions", "true");
      sessionStorage.setItem("showSession1", "true");
      sessionStorage.setItem("showPathwayView", "true");
      setIsPathwayGenerated(true);
      setShowPathwayDesign(true);
      if (onGenerated) onGenerated();
      console.log("Pathway started successfully");
    } catch (error) {
      console.error("Failed to start pathway:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSessionStatus = (stepId) => {
    const summaryStr = localStorage.getItem("session_history_summary");
    if (summaryStr) {
      const summary = JSON.parse(summaryStr);
      const currentDomain = sessionStorage.getItem("currentPathwayDomain")?.toLowerCase();
      const domainKey = Object.keys(summary.sessions).find(d => 
        currentDomain?.includes(d) || d.includes(currentDomain || "")
      ) || "emp";
      
      const status = summary.sessions[domainKey]?.[stepId];
      if (status === "COMPLETED") return "completed";
      if (status === "IN_PROGRESS") return "in_progress";
    }
    
    // Fallback to legacy logic/local state
    const done = completedSessions.includes(stepId);
    if (done) return "completed";

    const localStarted = localStorage.getItem(`session${stepId}_started`) === "true";
    if (localStarted) return "in_progress";
    
    if (stepId === 1) return "active";
    if (stepId === 2) return completedSessions.includes(1) ? "active" : "locked";
    if (stepId === 3) return completedSessions.includes(2) ? "active" : "locked";
    if (stepId === 4) return completedSessions.includes(3) ? "active" : "locked";
    
    return "locked";
  };

  const pathwaySteps = [
    {
      id: 1,
      type: "Expert knowledge",
      icon: "/assets/images/dashboard/expert.webp",
      duration: "8 min",
      title: "Common Understanding",
      description:
        "Explore research-based leadership concepts and identify how specialized workplace insights can accelerate your professional growth.",
      status: getSessionStatus(1),
      buttonText: getSessionStatus(1) === "completed" ? "View" : getSessionStatus(1) === "in_progress" ? "Continue element" : "Start element",
    },
    {
      id: 2,
      type: "Workbook",
      icon: "/assets/images/dashboard/workbook.webp",
      duration: "8 min",
      title: "Reflective Practice",
      description:
        "Engage in reflective exercises to analyze your current leadership style and identify specific areas for behavioral improvement.",
      status: getSessionStatus(2),
      buttonText: getSessionStatus(2) === "completed" ? "View" : getSessionStatus(2) === "in_progress" ? "Continue element" : "Start element",
    },
    {
      id: 3,
      type: "Workbook",
      icon: "/assets/images/dashboard/workbook.webp",
      duration: "8 min",
      title: "Application",
      description:
        "Practice implementing core leadership strategies through interactive scenarios designed to build confidence in real-world situations.",
      status: getSessionStatus(3),
      buttonText: getSessionStatus(3) === "completed" ? "View" : getSessionStatus(3) === "in_progress" ? "Continue element" : "Start element",
    },
    {
      id: 4,
      type: "Reflection",
      icon: "/assets/images/dashboard/expert.webp",
      duration: "15 min",
      title: "Integration",
      description:
        "Synthesize your learnings into a sustainable action plan, ensuring your new leadership skills are fully integrated into your daily routine.",
      status: getSessionStatus(4),
      buttonText: getSessionStatus(4) === "completed" ? "View" : getSessionStatus(4) === "in_progress" ? "Continue element" : "Start element",
    },
  ];

  return (
    <>
      <section
        data-tour="leadership-pathway"
        className={`py-8 lg:py-12 ${showPathwayDesign
          ? "  px-4 sm:px-6 lg:px-8 border border-[#E8E8E8] rounded-2xl"
          : " "
          }`}
      >
        <div className="mb-8 sm:mb-12 ">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 font-cormorant">
            Leadership Pathway
          </h2>
          <p className="text-base text-[#3D3D3D]/60 font-inter">
            Your pathway to convert your Grow areas to Glow areas
          </p>
        </div>

        {showPathwayDesign ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between relative ">
                <div className="absolute top-1/2 left-0 right-0 h-2 lg:h-4 rounded-full bg-[#E5E5E5] -translate-y-1/2 z-0"></div>
                <div
                  className={`absolute top-1/2 left-0 h-2 lg:h-4 rounded-full bg-[#5C91E0] -translate-y-1/2 z-10 ${
                    getSessionStatus(4) === "completed"
                      ? "w-full"
                      : getSessionStatus(3) === "completed"
                      ? "w-3/4"
                      : getSessionStatus(2) === "completed"
                      ? "w-2/4"
                      : getSessionStatus(1) === "completed"
                      ? "w-1/4"
                      : "w-[12.5%]"
                  }`}
                ></div>
                {pathwaySteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative z-20 flex flex-col items-center flex-1"
                  >
                    <div
                      className={`lg:w-10 lg:h-10 w-7 h-7   rounded-full flex items-center justify-center border-2 transition-all ${
                        step.status === "active" || step.status === "completed"
                          ? "bg-white border-none  shadow-sm"
                          : "bg-white border-[#E5E5E5]"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <Check
                          className="lg:w-5 lg:h-5 w-4 h-4   text-[#5C91E0]"
                          strokeWidth={3}
                        />
                      ) : step.status === "active" ? (
                        <div className="lg:w-3 lg:h-3 w-2 h-2 rounded-full bg-[#5C91E0]"></div>
                      ) : (
                        <Lock className="lg:w-5 lg:h-5 w-3 h-3  text-[#9CA3AF]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pathwaySteps.map((step) => (
                <div
                  key={step.id}
                  className={`bg-white border-2 rounded-2xl p-4 md:p-5 lg:p-6 transition-all ${step.status === "active" || step.status === "completed"
                    ? "border-none shadow-sm"
                    : "border-none opacity-40"
                    }`}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                      <img
                        src={step.icon}
                        alt={step.type}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0"
                      />
                      <p
                        className={`text-xs sm:text-sm font-inter-medium truncate ${step.status === "active" ||
                          step.status === "completed"
                          ? "text-[#3D3D3D]"
                          : "text-[#9CA3AF]"
                          }`}
                      >
                        {step.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Clock
                        className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${step.status === "active"
                          ? "text-[#9CA3AF]"
                          : "text-[#9CA3AF]"
                          }`}
                      />
                      <p
                        className={`text-xs sm:text-sm font-inter ${step.status === "active"
                          ? "text-[#9CA3AF]"
                          : "text-[#9CA3AF]"
                          }`}
                      >
                        {step.duration}
                      </p>
                    </div>
                  </div>
                  <h3
                    className={`text-base sm:text-lg md:text-xl font-cormorant font-bold mb-2 md:mb-3 ${step.status === "active" || step.status === "completed"
                      ? "text-[#3D3D3D]"
                      : "text-[#9CA3AF]"
                      }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm md:text-base font-inter mb-4 md:mb-6 leading-relaxed ${step.status === "active" || step.status === "completed"
                      ? "text-[#3D3D3D]/70"
                      : "text-[#9CA3AF]"
                      }`}
                  >
                    {step.description}
                  </p>
                  {step.status === "completed" ? (
                    <button
                      onClick={() => {
                        if (step.id === 1) {
                          setIsSessionModalOpen(true);
                        } else if (step.id === 2) {
                          setIsSession2ModalOpen(true);
                        } else if (step.id === 3) {
                          setIsSession3ModalOpen(true);
                        } else if (step.id === 4) {
                          setIsSession4ModalOpen(true);
                        }
                      }}
                      className=" px-4 py-2 bg-[#F5F5F5] text-[#3D3D3D] rounded-xl font-inter-medium text-xs sm:text-sm md:text-base transition-colors hover:bg-[#E5E5E5]"
                    >
                      {step.buttonText}
                    </button>
                  ) : (step.status === "active" || step.status === "in_progress") ? (
                    <button
                      onClick={() => {
                        if (step.status === "in_progress") {
                          sessionStorage.setItem(`showSession${step.id}`, "true");
                          sessionStorage.setItem("selectedConversation", `session${step.id}`);
                          sessionStorage.setItem("startedFromDashboard", "true");
                          navigate("/amalia-corner");
                        } else {
                          if (step.id === 2) {
                            setIsSession2ModalOpen(true);
                          } else if (step.id === 3) {
                            setIsSession3ModalOpen(true);
                          } else if (step.id === 4) {
                            setIsSession4ModalOpen(true);
                          } else {
                            setIsSessionModalOpen(true);
                          }
                        }
                      }}
                      className=" px-4 py-2 bg-[#3D3D3D] text-white rounded-xl font-inter-medium text-xs sm:text-sm md:text-base transition-colors hover:bg-[#2D2D2D]"
                    >
                      {step.buttonText}
                    </button>
                  ) : (
                    <button
                      className=" px-4 py-2 bg-[#F5F5F5] text-[#9CA3AF] rounded-xl font-inter-medium text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 cursor-not-allowed"
                      disabled
                    >
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                      Locked
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative border border-[#0000000A] bg-gray-100 rounded-2xl p-6 overflow-hidden lg:min-h-[250px] min-h-[150px] flex items-center justify-center">
            <img
              src="/assets/images/dashboard/Actionsleft.webp"
              alt="dashboard top background"
              className="absolute bottom-0 left-0 lg:w-[500px] z-50 w-[120px] h-[120px] lg:h-[400px] object-cover object-top"
            />
            <div className="relative z-10 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl lg:text-3xl font-bold text-[#3D3D3D] mb-1 font-cormorant">
                Action items
              </h3>
              <p className="lg:text-base text-xs text-[#3D3D3D]/60 font-inter max-w-xs mx-auto mb-6">
                Amalia will share action items with you for your personalized
                Leadership Pathway
              </p>
              {hasVisitedAmaliaCorner && (
                <button
                  onClick={handleManualGenerate}
                  disabled={isGenerating}
                  className={`px-6 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D] ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isGenerating ? "Generating..." : "Generate my Leadership Pathway"}
                </button>
              )}
            </div>
            <img
              src="/assets/images/dashboard/ActionRight.webp"
              alt="dashboard top background"
              className="absolute top-0 right-0 lg:w-[500px] z-50 w-[120px] h-[120px] lg:h-[400px] object-cover object-top"
            />
          </div>
        )}
      </section>
      <LeadershipPathwayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
      />
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
      />
      <Session2Modal
        isOpen={isSession2ModalOpen}
        onClose={() => setIsSession2ModalOpen(false)}
      />
      <Session3Modal
        isOpen={isSession3ModalOpen}
        onClose={() => setIsSession3ModalOpen(false)}
      />
      <Session4Modal
        isOpen={isSession4ModalOpen}
        onClose={() => setIsSession4ModalOpen(false)}
      />
    </>
  );
};
export default LeadershipPathwaySection;
