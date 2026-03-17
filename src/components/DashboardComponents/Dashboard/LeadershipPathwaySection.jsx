import React, { useState, useEffect } from "react";
import { Clock, Lock, Check } from "lucide-react";
import LeadershipPathwayModal from "../AllModals/LeadershipPathwayModal";
import SessionModal from "../AllModals/SessionModal";
import Session2Modal from "../AllModals/Session2Modal";
import Session3Modal from "../AllModals/Session3Modal";
import Session4Modal from "../AllModals/Session4Modal";
import { pathwayService } from "../../../services/pathway";

const LeadershipPathwaySection = ({ hasVisitedAmaliaCorner = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSession2ModalOpen, setIsSession2ModalOpen] = useState(false);
  const [isSession3ModalOpen, setIsSession3ModalOpen] = useState(false);
  const [isSession4ModalOpen, setIsSession4ModalOpen] = useState(false);
  const [showPathwayDesign, setShowPathwayDesign] = useState(() => {
    try {
      const fromStart = sessionStorage.getItem("fromStartSession");
      if (fromStart === "true") return true;
      const saved = localStorage.getItem("amalia_completed_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0;
      }
    } catch {
      // ignore
    }
    return false;
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
    const fromStartSession = sessionStorage.getItem("fromStartSession");
    if (fromStartSession === "true") {
      setShowPathwayDesign(true);
    }

    // Re-read completedSessions on mount in case they were updated
    try {
      const saved = localStorage.getItem("amalia_completed_sessions");
      if (saved) setCompletedSessions(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Derive per-session state from completedSessions
  const session1Done = completedSessions.includes(1);
  const session2Done = completedSessions.includes(2);
  const session3Done = completedSessions.includes(3);

  const handleGeneratePathway = () => {
    setIsModalOpen(true);
  };

  const handleGenerate = async () => {
    console.log("Generate Leadership Pathway clicked");
    try {
      const response = await pathwayService.startPathway();
      if (response && response.domain) {
        sessionStorage.setItem("currentPathwayDomain", response.domain);
      }
      console.log("Pathway started successfully");
    } catch (error) {
      console.error("Failed to start pathway:", error);
    }
  };

  const pathwaySteps = [
    {
      id: 1,
      type: "Expert knowledge",
      icon: "/assets/images/dashboard/expert.webp",
      duration: "8 min",
      title: "Common Understanding",
      description:
        "Introducing ideas that matter to women and their place at work, based on research and industry reporting.",
      status: session1Done ? "completed" : "active",
      buttonText: session1Done ? "View" : "Start element",
    },
    {
      id: 2,
      type: "Workbook",
      icon: "/assets/images/dashboard/workbook.webp",
      duration: "8 min",
      title: "Reflective Practice",
      description:
        "Small description about the element contents. Lorem ipsum sit dolor amet avec consect.",
      status: session2Done ? "completed" : session1Done ? "active" : "locked",
      buttonText: session2Done ? "View" : "Start element",
    },
    {
      id: 3,
      type: "Workbook",
      icon: "/assets/images/dashboard/workbook.webp",
      duration: "8 min",
      title: "Application",
      description:
        "Small description about the element contents. Lorem ipsum sit dolor amet avec consect.",
      status: session3Done ? "completed" : session2Done ? "active" : "locked",
      buttonText: session3Done ? "View" : "Start element",
    },
    {
      id: 4,
      type: "Reflection",
      icon: "/assets/images/dashboard/expert.webp",
      duration: "15 min",
      title: "Integration",
      description:
        "Small description about the element contents. Lorem ipsum sit dolor amet avec consect.",
      status: session3Done ? "active" : "locked",
      buttonText: "Start element",
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
                  className={`absolute top-1/2 left-0 h-2 lg:h-4 rounded-full bg-[#5C91E0] -translate-y-1/2 z-10 ${session3Done
                    ? "w-full"
                    : session2Done
                      ? "w-3/4"
                      : session1Done
                        ? "w-2/4"
                        : "w-1/4"
                    }`}
                ></div>
                {pathwaySteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative z-20 flex flex-col items-center flex-1"
                  >
                    <div
                      className={`lg:w-10 lg:h-10 w-7 h-7   rounded-full flex items-center justify-center border-2 transition-all ${step.status === "active" || step.status === "completed"
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
                        }
                      }}
                      className=" px-4 py-2 bg-[#F5F5F5] text-[#3D3D3D] rounded-xl font-inter-medium text-xs sm:text-sm md:text-base transition-colors hover:bg-[#E5E5E5]"
                    >
                      {step.buttonText}
                    </button>
                  ) : step.status === "active" ? (
                    <button
                      onClick={() => {
                        if (step.id === 2) {
                          setIsSession2ModalOpen(true);
                        } else if (step.id === 3) {
                          setIsSession3ModalOpen(true);
                        } else if (step.id === 4) {
                          setIsSession4ModalOpen(true);
                        } else {
                          setIsSessionModalOpen(true);
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
                  onClick={handleGeneratePathway}
                  className="px-5 py-3 bg-[#3D3D3D] text-white rounded-xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
                >
                  Generate my Leadership Pathway
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
