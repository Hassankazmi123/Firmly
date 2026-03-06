import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ProgressBarsSection from "./ProgressBarsSection";
import SummaryCard from "./SummaryCard";
import ChatInputFooter from "./ChatInputFooter";
import Session1Chat from "./Session1Chat";
import Session2Chat from "./Session2Chat";
import Session3Chat from "./Session3Chat";
import Session4Chat from "./Session4Chat";
import { Clock, Lock } from "lucide-react";
import { pathwayService } from "../../../services/pathway";
import { assessmentService } from "../../../services/assessment";
import { getUserProfile } from "../../../services/api";
const AmaliaCornerLayout = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [showPathwayView, setShowPathwayView] = useState(false);
  const [showSession1, setShowSession1] = useState(false);
  const [showSession2, setShowSession2] = useState(false);
  const [showSession3, setShowSession3] = useState(false);
  const [showSession4, setShowSession4] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [glowItems, setGlowItems] = useState([]);
  const [growItems, setGrowItems] = useState([]);
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        if (data && data.first_name) {
          setFirstName(data.first_name);
        }
        if (data && data.id) {
          setUserId(data.id);
        } else if (data && data.email) {
          setUserId(data.email);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  // Load chat history for user on mount or when userId changes
  useEffect(() => {
    if (!userId) return;
    const saved = localStorage.getItem(`amaliaChat_${userId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [userId]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(messages));
  }, [messages, userId]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !isSidebarCollapsed) {
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
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const savedConversation = sessionStorage.getItem("selectedConversation");

    const shouldShowPathway = sessionStorage.getItem("showLeadershipPathway");
    if (shouldShowPathway === "true") {
      setShowPathwayView(true);
      // We keep this one-time flag removal as it's an entry point from Dashboard
      sessionStorage.removeItem("showLeadershipPathway");
    }

    const s1 = sessionStorage.getItem("showSession1") === "true";
    const s2 = sessionStorage.getItem("showSession2") === "true";
    const s3 = sessionStorage.getItem("showSession3") === "true";
    const s4 = sessionStorage.getItem("showSession4") === "true";

    if (s1) setShowSession1(true);
    if (s2) setShowSession2(true);
    if (s3) setShowSession3(true);
    if (s4) setShowSession4(true);

    if (savedConversation) {
      setSelectedConversation(savedConversation);
    } else if (s4) {
      setSelectedConversation("session4");
    } else if (s3) {
      setSelectedConversation("session3");
    } else if (s2) {
      setSelectedConversation("session2");
    } else if (s1) {
      setSelectedConversation("session1");
    } else {
      setSelectedConversation("diagnostic");
    }
  }, []);

  useEffect(() => {
    const detectDomain = async () => {
      const existingDomain = sessionStorage.getItem("currentPathwayDomain");
      if (
        !existingDomain ||
        existingDomain === "null" ||
        existingDomain === "undefined"
      ) {
        try {
          const response = await pathwayService.startPathway();
          // Handle both new pathway (200) and existing pathway (409)
          if (response && response.domain) {
            sessionStorage.setItem("currentPathwayDomain", response.domain);
            console.log("Pathway domain set to:", response.domain);
          } else if (response && response.statusCode === 409) {
            console.log("Using existing pathway, attempting to fetch domain info");
            // Pathway exists but no domain in response, try to fetch next session info
            try {
              const nextSessionInfo = await pathwayService.getNextSessionInfo();
              if (nextSessionInfo && nextSessionInfo.domain) {
                sessionStorage.setItem("currentPathwayDomain", nextSessionInfo.domain);
              }
            } catch (infoErr) {
              console.warn("Could not fetch next session info:", infoErr.message);
            }
          }
        } catch (e) {
          console.error("Auto domain detection failed:", e.message);
        }
      }
    };
    detectDomain();
  }, []);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        let assessmentId = localStorage.getItem("assessmentId");
        let data = null;
        let retryCount = 0;
        const maxRetries = 2;

        // Retry loop to handle 403 and other transient errors
        while (retryCount < maxRetries && !data) {
          try {
            // If no assessment ID or failed to get results, start/resume assessment
            if (!assessmentId) {
              console.log("No assessment ID, starting new assessment...");
              const startData = await assessmentService.startAssessment("v1");
              assessmentId = startData?.id || startData?.run_id || startData?.assessment_id || startData?.assessmentId;
              if (assessmentId) {
                localStorage.setItem("assessmentId", String(assessmentId));
              }
            }

            if (assessmentId) {
              data = await assessmentService.getResults(assessmentId);
            } else {
              throw new Error("Could not obtain assessment ID");
            }
          } catch (err) {
            retryCount++;
            console.warn(`Attempt ${retryCount}: ${err.message}`);

            // If 403 Forbidden or 404 Not Found, try starting a fresh assessment
            if ((err.statusCode === 403 || err.statusCode === 404) && retryCount < maxRetries) {
              try {
                console.log("Attempting to start a fresh assessment due to error...");
                const startData = await assessmentService.startAssessment("v1");
                const newId = startData?.id || startData?.run_id || startData?.assessment_id || startData?.assessmentId;
                if (newId) {
                  localStorage.setItem("assessmentId", String(newId));
                  assessmentId = String(newId);
                  console.log("Fresh assessment started with ID:", assessmentId);
                  // Continue loop to retry getResults with new ID
                  continue;
                }
              } catch (startErr) {
                console.error("Failed to start fresh assessment:", startErr.message);
                throw startErr;
              }
            }

            if (retryCount >= maxRetries) {
              throw err;
            }
          }
        }

        if (data && data.domains && data.glow && data.grow) {
          const domainLabels = {
            GOAL: "Goal Orientation",
            BELONG: "Workplace Belonging",
            ENG: "Engagement",
            RES: "Resilience",
            SELF: "Self-belief",
            EMP: "Empathy",
          };

          const domainAbbreviations = {
            GOAL: "GOA",
            BELONG: "WOR",
            ENG: "ENG",
            RES: "RES",
            SELF: "SEL",
            EMP: "EMP",
          };

          // Map glow items
          const glowData = data.glow.map((domainCode) => {
            const domainData = data.domains.find(
              (d) => d.domain === domainCode,
            );
            return {
              abbreviation: domainAbbreviations[domainCode] || domainCode,
              label: domainLabels[domainCode] || domainCode,
              score: domainData
                ? Math.round(parseFloat(domainData.percent_0_100))
                : 0,
            };
          });

          // Map grow items
          const growData = data.grow.map((domainCode) => {
            const domainData = data.domains.find(
              (d) => d.domain === domainCode,
            );
            return {
              abbreviation: domainAbbreviations[domainCode] || domainCode,
              label: domainLabels[domainCode] || domainCode,
              score: domainData
                ? Math.round(parseFloat(domainData.percent_0_100))
                : 0,
            };
          });

          setGlowItems(glowData);
          setGrowItems(growData);
        }
      } catch (error) {
        console.error("Failed to fetch assessment data for glow/grow:", error);
        // Fallback to default data
        setGlowItems([
          { abbreviation: "GOA", label: "Goal Orientation", score: 96 },
          { abbreviation: "WOR", label: "Workplace Belonging", score: 89 },
          { abbreviation: "RES", label: "Resilience", score: 87 },
        ]);
        setGrowItems([
          { abbreviation: "EMP", label: "Empathy", score: 32 },
          { abbreviation: "ENG", label: "Engagement", score: 24 },
          { abbreviation: "SEL", label: "Self-belief", score: 22 },
        ]);
      }
    };

    fetchAssessmentData();
  }, []);

  useEffect(() => {
    if (showPathwayView) {
      const fetchNextSessionInfo = async () => {
        try {
          const info = await pathwayService.getNextSessionInfo();
          if (info) {
            console.log("Next session info:", info);
            // Info is logged but currently not used in UI to avoid unused-vars
          }
        } catch (error) {
          console.error("Failed to fetch next session info:", error);
        }
      };
      fetchNextSessionInfo();
    }
  }, [showPathwayView]);

  const handleConversationSelect = (conversationId) => {
    sessionStorage.setItem("selectedConversation", conversationId);
    if (conversationId === "cultivating-empathy") {
      if (showSession1) {
        setShowSession1(false);
        setShowSession2(false);
        setShowSession3(false);
        setShowSession4(false);
        setSelectedConversation("diagnostic");
        sessionStorage.setItem("selectedConversation", "diagnostic");
      } else {
        setShowSession1(true);
        setSelectedConversation("session1");
        sessionStorage.setItem("showSession1", "true");
        sessionStorage.setItem("selectedConversation", "session1");
      }
    } else if (conversationId === "diagnostic") {
      setSelectedConversation("diagnostic");
    } else if (conversationId === "session1") {
      setShowSession1(true);
      setSelectedConversation("session1");
      sessionStorage.setItem("showSession1", "true");
    } else if (conversationId === "session2") {
      setShowSession1(true);
      setShowSession2(true);
      setSelectedConversation("session2");
      sessionStorage.setItem("showSession1", "true");
      sessionStorage.setItem("showSession2", "true");
    } else if (conversationId === "session3") {
      setShowSession1(true);
      setShowSession2(true);
      setShowSession3(true);
      setSelectedConversation("session3");
      sessionStorage.setItem("showSession1", "true");
      sessionStorage.setItem("showSession2", "true");
      sessionStorage.setItem("showSession3", "true");
    } else if (conversationId === "session4") {
      setShowSession1(true);
      setShowSession2(true);
      setShowSession3(true);
      setShowSession4(true);
      setSelectedConversation("session4");
      sessionStorage.setItem("showSession1", "true");
      sessionStorage.setItem("showSession2", "true");
      sessionStorage.setItem("showSession3", "true");
      sessionStorage.setItem("showSession4", "true");
    }
  };
  const initialMessage = (
    <>
      Hi {firstName}, <br />I'm so glad you decided to dive deeper into your results
      with me. What I see in your diagnostic is really quite insightful - it
      paints a clear picture of who you are as a leader right now and where your
      greatest opportunities lie. Let's start by looking at your overall profile
      together.
      <br />
      The 'peers' benchmark shows you how your scores compare to other women in
      your organization who have completed this same diagnostic, giving you
      valuable context for understanding your results relative to your workplace
      environment.
    </>
  );
  const handleGeneratePathway = async () => {
    try {
      const response = await pathwayService.startPathway();
      // Handle both new pathway (200) and existing pathway (409)
      if (response && response.domain) {
        sessionStorage.setItem("currentPathwayDomain", response.domain);
        console.log("Pathway domain set:", response.domain);
      } else if (response && response.statusCode === 409) {
        console.log("Pathway already exists, will use existing one");
        // Pathway exists, continue without error
      }
    } catch (e) {
      console.error("Failed to start pathway from layout:", e.message);
    }

    const pathwayMessage = (
      <>
        Great! Let's work together to create your personalized Leadership
        Pathway. Based on your Glow and Grow areas, I'll help you develop a
        tailored plan to enhance your leadership skills and reach your full
        potential.
        <br />
        <br />
        Let's start by discussing your goals and priorities. What would you like
        to focus on first?
      </>
    );
    setMessages([...messages, pathwayMessage]);
  };
  const handleGoToDashboard = () => {
    sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
    navigate("/dashboard", { state: { fromAmaliaCorner: true } });
  };

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), type: "user", content: text };
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      // Save immediately for responsiveness
      if (userId) {
        localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated));
      }
      return updated;
    });

    try {
      let domain = getDomain();
      // Keyword-based domain switching fallback
      const lowerText = text.toLowerCase();
      if (lowerText.includes("resilience") || lowerText.includes("resilien") || lowerText.includes(" res")) {
        domain = "res";
        sessionStorage.setItem("currentPathwayDomain", "res");
      } else if (lowerText.includes("goal")) {
        domain = "goal";
        sessionStorage.setItem("currentPathwayDomain", "goal");
      } else if (lowerText.includes("engagement") || lowerText.includes("engage")) {
        domain = "eng";
        sessionStorage.setItem("currentPathwayDomain", "eng");
      } else if (lowerText.includes("self") && lowerText.includes("awareness")) {
        domain = "self";
        sessionStorage.setItem("currentPathwayDomain", "self");
      } else if (lowerText.includes("belonging") || lowerText.includes("belong")) {
        domain = "belong";
        sessionStorage.setItem("currentPathwayDomain", "belong");
      }

      let historyData;
      if (domain === "goal") {
        await pathwayService.sendGoalMessageSession1(text, "CORE");
        historyData = await pathwayService.getGoalHistorySession1();
      } else if (domain === "res") {
        await pathwayService.sendResilienceMessageSession1(text, "CORE");
        historyData = await pathwayService.getResilienceHistorySession1();
      } else if (domain === "eng") {
        await pathwayService.sendEngagementMessageSession1(text, "CORE");
        historyData = await pathwayService.getEngagementHistorySession1();
      } else if (domain === "self") {
        await pathwayService.sendSelfAwarenessMessageSession1(text, "CORE");
        historyData = await pathwayService.getSelfAwarenessHistorySession1();
      } else if (domain === "belong") {
        await pathwayService.sendBelongingMessageSession1(text, "CORE");
        historyData = await pathwayService.getBelongingHistorySession1();
      } else {
        await pathwayService.sendEmpathyMessage(text, "CORE");
        historyData = await pathwayService.getEmpathyHistory();
      }

      // Only append the latest bot response
      const historyMessages = Array.isArray(historyData) ? historyData : historyData?.messages || [];
      const latestBotMsg = historyMessages
        .filter((msg) => !msg.sender || msg.sender.toLowerCase().trim() !== "user")
        .slice(-1)[0];
      if (latestBotMsg) {
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              id: latestBotMsg.id || Date.now(),
              type: "amalia",
              content: latestBotMsg.text || latestBotMsg.content,
            },
          ];
          if (userId) {
            localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated));
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to send message in diagnostic view:", error);
    }
  };

  const getDomain = () => {
    const rawDomain = sessionStorage.getItem("currentPathwayDomain");
    if (!rawDomain || rawDomain === "null" || rawDomain === "undefined")
      return "emp";
    const d = rawDomain.toLowerCase();
    if (
      d.includes("resilience") ||
      d.includes("resilien") ||
      d.includes(" res")
    )
      return "res";
    if (d.includes("goal")) return "goal";
    if (d.includes("engagement") || d.includes("engage")) return "eng";
    if (d.includes("self")) return "self";
    if (d.includes("belonging") || d.includes("belong")) return "belong";
    if (d.includes("empathy") || d.includes("emp")) return "emp";
    return "emp";
  };

  const handleStartSession = () => {
    // Start pathway and show feedback in chat
    const startPathwayAndShowFeedback = async () => {
      try {
        const response = await pathwayService.startPathway();
        // Handle both new pathway (200) and existing pathway (409)
        if (response && response.domain) {
          sessionStorage.setItem("currentPathwayDomain", response.domain);
          setMessages((prev) => {
            const updated = [
              ...prev,
              {
                id: Date.now(),
                type: "amalia",
                content:
                  `Pathway started! Your growth area is: ${response.domain.toUpperCase()}. Let's begin your personalized sessions.`,
              },
            ];
            if (userId) {
              localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated));
            }
            return updated;
          });
        } else if (response && response.statusCode === 409) {
          setMessages((prev) => {
            const updated = [
              ...prev,
              {
                id: Date.now(),
                type: "amalia",
                content:
                  "You already have an active pathway. Continuing with your existing sessions.",
              },
            ];
            if (userId) {
              localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated));
            }
            return updated;
          });
        }
      } catch (e) {
        setMessages((prev) => {
          const updated = [
            ...prev,
            {
              id: Date.now(),
              type: "amalia",
              content: "Failed to start pathway. Please try again later.",
            },
          ];
          if (userId) {
            localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated));
          }
          return updated;
        });
      }
      sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
      sessionStorage.setItem("fromStartSession", "true");
      // Optionally, navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    };
    startPathwayAndShowFeedback();
  };

  const domain = getDomain();

  const getDomainLabel = () => {
    switch (domain) {
      case "goal":
        return "Goal Setting";
      case "res":
        return "Resilience";
      case "eng":
        return "Engagement";
      case "self":
        return "Self Awareness";
      case "belong":
        return "Belonging";
      default:
        return "Empathy";
    }
  };

  const getSessionTitle = (num) => {
    switch (domain) {
      case "goal":
        if (num === 1) return "Strategic Leadership Goals";
        if (num === 2) return "Growth Mindset and Goal Accuracy";
        if (num === 3) return "Actionable Goal Framework";
        if (num === 4) return "Integration and Long-term Success";
        break;
      case "res":
        if (num === 1) return "The Foundation of Resilience";
        if (num === 2) return "Stress Management & Adaptability";
        if (num === 3) return "Building a Resilient Mindset";
        if (num === 4) return "Sustainable Performance Integration";
        break;
      case "eng":
        if (num === 1) return "The Drivers of Team Engagement";
        if (num === 2) return "Identifying Engagement Gaps";
        if (num === 3) return "Actionable Engagement Strategies";
        if (num === 4) return "Sustaining High Engagement";
        break;
      case "self":
        if (num === 1) return "Building Self Awareness";
        if (num === 2) return "Understanding Emotions";
        if (num === 3) return "Mindful Leadership";
        if (num === 4) return "Integrating Awareness";
        break;
      case "belong":
        if (num === 1) return "Foundations of Belonging";
        if (num === 2) return "Inclusion in Practice";
        if (num === 3) return "Building Connections";
        if (num === 4) return "Sustaining Belonging";
        break;
      default:
        if (num === 1) return "The Power of Empathetic Leadership";
        if (num === 2) return "Reflective Practice - Empathy in Action";
        if (num === 3) return "The Empathy Toolkit - Practical Applications";
        if (num === 4) return "Integration and Forward Movement";
    }
    return "";
  };

  const domainLabel = getDomainLabel();
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        showSession1={showSession1}
        showSession2={showSession2}
        showSession3={showSession3}
        showSession4={showSession4}
        onConversationSelect={handleConversationSelect}
        selectedConversation={selectedConversation}
      />
      <div className="flex-1  flex flex-col overflow-hidden bg-white rounded-2xl border border-[#ECECEC] relative">
        <ChatHeader
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        {selectedConversation === "session1" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session1Chat isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        ) : selectedConversation === "session2" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session2Chat isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        ) : selectedConversation === "session3" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session3Chat isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        ) : selectedConversation === "session4" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session4Chat isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-w-5xl mx-auto  px-4 pb-24 relative">
            {showPathwayView ? (
              <>
                <div className="mb-8">
                  <p className="text-base md:text-lg text-[#3D3D3D] font-inter">
                    I'll create a personalized development plan focused on your
                    growth areas.
                  </p>
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl p-6 md:p-8 mb-8">
                  <p className="text-base md:text-lg text-[#3D3D3D] font-inter mb-6">
                    We'll start with{" "}
                    <span className="font-semibold">{domainLabel}</span>. For
                    that, I've scheduled 4 sessions for you:
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-[#6664D3] font-bold mt-1">•</span>
                      <span className="text-base text-[#3D3D3D] font-inter">
                        Session 1: {getSessionTitle(1)} (Common Understanding)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#6664D3] font-bold mt-1">•</span>
                      <span className="text-base text-[#3D3D3D] font-inter">
                        Session 2: {getSessionTitle(2)}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#6664D3] font-bold mt-1">•</span>
                      <span className="text-base text-[#3D3D3D] font-inter">
                        Session 3: {getSessionTitle(3)}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#6664D3] font-bold mt-1">•</span>
                      <span className="text-base text-[#3D3D3D] font-inter">
                        Session 4: {getSessionTitle(4)}
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm md:text-base text-[#3D3D3D]/70 font-inter mb-4 leading-relaxed">
                    Each session is designed to be conversational and practical,
                    building on real workplace scenarios. We'll work together to
                    develop your empathetic leadership skills through
                    evidence-based techniques.
                  </p>
                  <p className="text-sm md:text-base text-[#3D3D3D]/70 font-inter">
                    You would always have this pathway on the main dashboard so
                    you can work on all the points one by one.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={handleStartSession}
                    className="flex-1 px-6 py-3 bg-[#F5F5F5] text-[#3D3D3D] rounded-xl font-inter-medium text-base hover:bg-[#E5E5E5] transition-colors"
                  >
                    Start Session
                  </button>
                  <button
                    onClick={handleGoToDashboard}
                    className="flex-1 px-6 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter-medium text-base hover:bg-[#2D2D2D] transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            ) : (
              <>
                <ChatMessage message={initialMessage} />
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}
                <ProgressBarsSection />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <SummaryCard
                    title="Doing great"
                    subtitle="Your female talent is thriving in the following domains."
                    items={glowItems}
                    bgColor="bg-[#378C78]"
                    iconImage="/assets/images/dashboard/doing.webp"
                  />
                  <SummaryCard
                    title="Growth areas"
                    subtitle="These areas need your immediate attention to balance workplace wellbeing."
                    items={growItems}
                    bgColor="bg-[#C56A55]"
                    iconImage="/assets/images/dashboard/growth.webp"
                  />
                </div>
                <p className="text-sm md:text-base font-inter-regular text-black   bg-[#F5F5FF] p-4 rounded-xl">
                  You can now view your Glow and Grow areas at all times on your
                  dashboard. I will help you to work on them and improve your
                  skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 my-6 md:my-8  max-w-2xl mx-auto">
                  <button
                    onClick={handleGeneratePathway}
                    className="flex-1 px-5  py-3.5  bg-[#F5F5F5]  text-[#578DDD] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#E5E5E5]"
                  >
                    Generate my Leadership Pathway
                  </button>
                  <button
                    onClick={handleGoToDashboard}
                    className="flex-1   py-3.5 px-5  bg-[#3D3D3D] text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
                  >
                    Go to Dashboard
                  </button>
                </div>
                <div className="mb-8">
                  <p className="text-sm md:text-base font-inter-regular text-black  mb-6 md:mb-8 bg-[#F5F5FF] p-4 rounded-xl">
                    I'll create a personalized development plan focused on your
                    growth areas.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white border-2 border-[#f7f7f7] rounded-2xl p-5 ">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/dashboard/expert.webp"
                          alt="Workbook"
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-inter-medium text-[#3D3D3D]">
                            Expert knowledge
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#9CA3AF]" />
                          <p className="text-xs font-inter text-[#9CA3AF]">
                            8 min
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-cormorant font-bold text-[#3D3D3D] mb-3">
                      Common Understanding
                    </h3>
                    <p className="text-sm text-[#3D3D3D]/70 font-inter mb-6 leading-relaxed">
                      Introducing ideas that matter to women and their place at
                      work, based on research and industry reporting.
                    </p>
                    <button className=" px-4 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter-medium text-sm  transition-colors">
                      Start element
                    </button>
                  </div>
                  <div className="bg-white border-2 border-[#f7f7f7] rounded-2xl p-5 opacity-60">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/dashboard/workbook.webp"
                          alt="Workbook"
                          className="w-6 h-6"
                        />
                        <div>
                          <p className="text-xs font-inter-medium text-[#9CA3AF]">
                            Workbook
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#9CA3AF]" />
                          <p className="text-xs font-inter text-[#9CA3AF]">
                            8 min
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-cormorant font-bold text-[#9CA3AF] mb-3">
                      Reflective Practice
                    </h3>
                    <p className="text-sm text-[#9CA3AF] font-inter mb-6 leading-relaxed">
                      Small description about the element contents. Lorem ipsum
                      sit dolor amet avec consect.
                    </p>
                    <button className=" px-4 py-3 bg-[#F5F5F5] text-[#9CA3AF] rounded-xl font-inter-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      Locked
                    </button>
                  </div>
                  <div className="bg-white border-2 border-[#f7f7f7] rounded-2xl p-5 opacity-60">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/dashboard/workbook.webp"
                          alt="Workbook"
                          className="w-6 h-6"
                        />
                        <div>
                          <p className="text-xs font-inter-medium text-[#9CA3AF]">
                            Workbook
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-[#9CA3AF]" />
                          <p className="text-xs font-inter text-[#9CA3AF]">
                            8 min
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-cormorant font-bold text-[#9CA3AF] mb-3">
                      Application
                    </h3>
                    <p className="text-sm text-[#9CA3AF] font-inter mb-6 leading-relaxed">
                      Small description about the element contents. Lorem ipsum
                      sit dolor amet avec consect.
                    </p>
                    <button className=" px-4 py-3 bg-[#F5F5F5] text-[#9CA3AF] rounded-xl font-inter-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      Locked
                    </button>
                  </div>
                </div>
                <div className="bg-[#F5F5FF] rounded-xl p-4  mb-4 md:mb-6">
                  <p className="text-base  text-black font-regular font-inter mb-2">
                    We'll start with {domainLabel}. For that, I've scheduled 4
                    sessions for you:
                  </p>
                  <ul className="space-y-1 mb-2">
                    <li className="flex items-center gap-3">
                      <span className="text-black font-bold ">•</span>
                      <span className="text-base text-black font-regular font-inter">
                        Session 1: {getSessionTitle(1)} (Common Understanding)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-black font-bold ">•</span>
                      <span className="text-base text-black font-regular font-inter">
                        Session 2: {getSessionTitle(2)}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-black font-bold ">•</span>
                      <span className="text-base text-black font-regular font-inter">
                        Session 3: {getSessionTitle(3)}
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-black font-bold ">•</span>
                      <span className="text-base text-black font-regular font-inter">
                        Session 4: {getSessionTitle(4)}
                      </span>
                    </li>
                  </ul>
                  <p className="text-base text-black font-regular/70 font-inter mb-2 leading-relaxed">
                    Each session is designed to be conversational and practical,
                    building on real workplace scenarios. We'll work together to
                    develop your {domainLabel.toLowerCase()} skills through
                    evidence-based techniques.
                  </p>
                  <p className="text-base text-black font-regular/70 font-inter">
                    You would always have this pathway on the main dashboard so
                    you can work on all the points one by one.
                  </p>
                </div>
                <div className="flex lg:flex-row flex-col gap-4 lg:max-w-sm lg:mx-auto">
                  <button
                    onClick={handleStartSession}
                    className="flex-1 px-5  py-3  bg-[#F5F5F5]  text-[#578DDD] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#E5E5E5]"
                  >
                    Start Session
                  </button>
                  <button
                    onClick={handleGoToDashboard}
                    className="flex-1 px-5 py-3 bg-[#3D3D3D] text-white rounded-2xl font-inter-medium text-base hover:bg-[#2D2D2D] transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {!showPathwayView &&
          selectedConversation !== "session1" &&
          selectedConversation !== "session2" &&
          selectedConversation !== "session3" &&
          selectedConversation !== "session4" && (
            <div
              className={`absolute bottom-0 left-0 right-0 ${isSidebarCollapsed ? "z-50" : ""
                } md:z-50`}
            >
              <ChatInputFooter onSend={handleSendMessage} />
            </div>
          )}
      </div>
    </div>
  );
};
export default AmaliaCornerLayout;
