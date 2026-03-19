import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ProgressBarsSection from "./ProgressBarsSection";
import SummaryCard from "./SummaryCard";
import ScrollReveal from "./ScrollReveal";
import ChatInputFooter from "./ChatInputFooter";
import Session1Chat from "./Session1Chat";
import Session2Chat from "./Session2Chat";
import Session3Chat from "./Session3Chat";
import Session4Chat from "./Session4Chat";
import { Clock, Lock } from "lucide-react";
import { pathwayService } from "../../../services/pathway";
import { assessmentService } from "../../../services/assessment";
import { getUserProfile } from "../../../services/api";
import { chatService } from "../../../services/chat";
import "./AmaliaCorner.css";

const AmaliaCornerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [showPathwayView, setShowPathwayView] = useState(() => {
    return sessionStorage.getItem("showPathwayView") === "true";
  });
  const [isTyping, setIsTyping] = useState(false);
  const hasHistoryAtMount = useRef(false);
  const [showSession1, setShowSession1] = useState(false);
  const [showSession2, setShowSession2] = useState(false);
  const [showSession3, setShowSession3] = useState(false);
  const [showSession4, setShowSession4] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [glowItems, setGlowItems] = useState([]);
  const [growItems, setGrowItems] = useState([]);
  const [firstName, setFirstName] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        return parsed.first_name;
      }
    } catch (e) {
      console.warn("Failed to parse user from localStorage:", e);
    }
    return "";
  });
  const [userInitials, setUserInitials] = useState(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        const first = parsed.first_name;
        const last = parsed.last_name;
        return (first.charAt(0) + last.charAt(0)).toUpperCase();
      }
    } catch (e) { }
    return "YO";
  });
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem("amalia_completed_sessions");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        if (data && data.first_name) {
          setFirstName(data.first_name);
        }
        if (data) {
          const first = data.first_name;
          const last = data.last_name;
          setUserInitials(
            (first.charAt(0) + last.charAt(0)).toUpperCase(),
          );
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
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          hasHistoryAtMount.current = true;
        }
        // Filter out corrupted JSX objects that were serialized to localStorage
        const sanitized = parsed.filter(
          (msg) => typeof msg.content === "string",
        );
        // Mark as history to disable animation on reload
        const historyMsgs = sanitized.map(m => ({ ...m, isHistory: true }));
        setMessages(historyMsgs);
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    }
  }, [userId]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(messages));
  }, [messages, userId]);

  useEffect(() => {
    localStorage.setItem(
      "amalia_completed_sessions",
      JSON.stringify(completedSessions),
    );
    // Sync session visibility with completed sessions
    if (completedSessions.includes(1)) setShowSession2(true);
    if (completedSessions.includes(2)) setShowSession3(true);
    if (completedSessions.includes(3)) setShowSession4(true);
  }, [completedSessions]);
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

    if (location.state?.showResults) {
      setSelectedConversation("diagnostic");
      // Small timeout to ensure the DOM is rendered before scrolling
      setTimeout(() => {
        const resultsEl = document.getElementById("diagnostic-results");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    } else if (savedConversation) {
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
  }, [location.state]);

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
            console.log(
              "Using existing pathway, attempting to fetch domain info",
            );
            // Pathway exists but no domain in response, try to fetch next session info
            try {
              const nextSessionInfo = await pathwayService.getNextSessionInfo();
              if (nextSessionInfo && nextSessionInfo.domain) {
                sessionStorage.setItem(
                  "currentPathwayDomain",
                  nextSessionInfo.domain,
                );
              }
            } catch (infoErr) {
              console.warn(
                "Could not fetch next session info:",
                infoErr.message,
              );
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
              assessmentId =
                startData?.id ||
                startData?.run_id ||
                startData?.assessment_id ||
                startData?.assessmentId;
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
            if (
              (err.statusCode === 403 || err.statusCode === 404) &&
              retryCount < maxRetries
            ) {
              try {
                console.log(
                  "Attempting to start a fresh assessment due to error...",
                );
                const startData = await assessmentService.startAssessment("v1");
                const newId =
                  startData?.id ||
                  startData?.run_id ||
                  startData?.assessment_id ||
                  startData?.assessmentId;
                if (newId) {
                  localStorage.setItem("assessmentId", String(newId));
                  assessmentId = String(newId);
                  console.log(
                    "Fresh assessment started with ID:",
                    assessmentId,
                  );
                  // Continue loop to retry getResults with new ID
                  continue;
                }
              } catch (startErr) {
                console.error(
                  "Failed to start fresh assessment:",
                  startErr.message,
                );
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

  const handleConversationSelect = React.useCallback((conversationId) => {
    sessionStorage.setItem("selectedConversation", conversationId);
    if (conversationId === "cultivating-empathy") {
      setShowSession1(true);
      setSelectedConversation("session1");
      sessionStorage.setItem("showSession1", "true");
      sessionStorage.setItem("selectedConversation", "session1");
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
  }, []);

  const handleNextSession = React.useCallback(
    (sessionNum) => {
      setCompletedSessions((prev) => {
        const next = prev.includes(sessionNum) ? prev : [...prev, sessionNum];
        localStorage.setItem("amalia_completed_sessions", JSON.stringify(next));
        return next;
      });

      // After every session, decide where to go based on entry point
      const startedFromDashboard =
        sessionStorage.getItem("startedFromDashboard") === "true";

      sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
      sessionStorage.setItem("fromStartSession", "true");
      sessionStorage.setItem("fromNextSession", "true");
      sessionStorage.setItem("completedSessionNum", String(sessionNum));

      if (startedFromDashboard) {
        sessionStorage.removeItem("startedFromDashboard");
        navigate("/dashboard");
      } else {
        // Stay in Amalia Corner but return to pathway view
        setSelectedConversation(null);
        sessionStorage.removeItem("selectedConversation");
      }

      // Unlock next sessions based on completion status
      if (sessionNum === 1) {
        setShowSession2(true);
        sessionStorage.setItem("showSession2", "true");
      } else if (sessionNum === 2) {
        setShowSession3(true);
        sessionStorage.setItem("showSession3", "true");
      } else if (sessionNum === 3) {
        setShowSession4(true);
        sessionStorage.setItem("showSession4", "true");
      }
    },
    [navigate],
  );

  const initialMessage = `Hi ${firstName}, \nI'm so glad you decided to dive deeper into your results with me. What I see in your diagnostic is really quite insightful - it paints a clear picture of who you are as a leader right now and where your greatest opportunities lie. Let's start by looking at your overall profile together.\n\nThe 'peers' benchmark shows you how your scores compare to other women in your organization who have completed this same diagnostic, giving you valuable context for understanding your results relative to your workplace environment.`;
  const handleGeneratePathway = async () => {
    if (showPathwayView) {
      sessionStorage.setItem("fromStartSession", "true");
      handleGoToDashboard();
      return;
    }

    const pathwayMessage = `Great! Let's work together to create your personalized Leadership Pathway. Based on your Glow and Grow areas, I'll help you develop a tailored plan to enhance your leadership skills and reach your full potential.\n\nLet's start by discussing your goals and priorities. What would you like to focus on first?`;

    setIsTyping(true);
    setTimeout(() => {
      setMessages([...messages, { type: "amalia", content: pathwayMessage }]);
      setIsTyping(false);
      setShowPathwayView(true);
      sessionStorage.setItem("showPathwayView", "true");
      sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
      sessionStorage.setItem("fromStartSession", "true");
      sessionStorage.setItem("showSession1", "true");
      localStorage.setItem("hasStartedSessions", "true");
    }, 1500);
  };
  const handleGoToDashboard = () => {
    sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
    navigate("/dashboard", { state: { fromAmaliaCorner: true } });
  };

  const [diagnosticThreadId, setDiagnosticThreadId] = useState(() => {
    return localStorage.getItem("amalia_diagnostic_thread_id");
  });

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), type: "user", content: text };
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      if (userId) {
        localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated));
      }
      return updated;
    });

    setIsTyping(true);

    try {
      let tId = diagnosticThreadId;
      if (!tId) {
        const response = await chatService.createNewThread(false, "Diagnostic Debrief");
        tId = response.id || response.thread_id;
        if (tId) {
          setDiagnosticThreadId(tId);
          localStorage.setItem("amalia_diagnostic_thread_id", String(tId));
        }
      }

      if (tId) {
        const response = await chatService.sendMessage(tId, text);
        // Depending on API response, get the AI message
        const botContent = response.response || response.message || response.content || (response.data && response.data.content);

        if (botContent) {
          setMessages((prev) => {
            const updated = [
              ...prev,
              {
                id: Date.now(),
                type: "amalia",
                content: botContent,
                isHistory: false,
              },
            ];
            if (userId) {
              localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated.map(m => {
                const { isHistory, ...rest } = m;
                return rest;
              })));
            }
            return updated;
          });
        } else {
          // Fallback: fetch history if sendMessage doesn't return content
          const historyData = await chatService.getChatHistory(tId);
          const historyArr = historyData.history || historyData.messages || historyData.data || [];
          const lastBot = historyArr.filter(m => m.role === "assistant" || m.role === "ai" || (m.sender && m.sender.toLowerCase() !== "user")).slice(-1)[0];
          if (lastBot) {
            setMessages((prev) => {
              const updated = [
                ...prev,
                {
                  id: lastBot.id || Date.now(),
                  type: "amalia",
                  content: lastBot.content || lastBot.text || lastBot.message,
                  isHistory: false,
                },
              ];
              if (userId) {
                localStorage.setItem(`amaliaChat_${userId}`, JSON.stringify(updated.map(m => {
                  const { isHistory, ...rest } = m;
                  return rest;
                })));
              }
              return updated;
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message in diagnostic view:", error);
    } finally {
      setIsTyping(false);
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
    localStorage.setItem("hasStartedDebrief", "true");
    sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
    sessionStorage.setItem("fromStartSession", "true");
    navigate("/dashboard");
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
            <Session1Chat
              isSidebarCollapsed={isSidebarCollapsed}
              onNextSession={() => handleNextSession(1)}
              userInitials={userInitials}
            />
          </div>
        ) : selectedConversation === "session2" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session2Chat
              isSidebarCollapsed={isSidebarCollapsed}
              onNextSession={() => handleNextSession(2)}
              userInitials={userInitials}
            />
          </div>
        ) : selectedConversation === "session3" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session3Chat
              isSidebarCollapsed={isSidebarCollapsed}
              onNextSession={() => handleNextSession(3)}
              userInitials={userInitials}
            />
          </div>
        ) : selectedConversation === "session4" ? (
          <div className="flex-1 overflow-hidden relative">
            <Session4Chat
              isSidebarCollapsed={isSidebarCollapsed}
              onComplete={() => handleNextSession(4)}
              userInitials={userInitials}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-w-5xl mx-auto px-4 pb-24 relative chat-container-scroll">
            <ChatMessage
              message={initialMessage}
              userInitials={userInitials}
              disableAnimation={
                !location.state?.animateInitial || 
                hasHistoryAtMount.current
              }
            />
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
                userInitials={userInitials}
                disableAnimation={msg.isHistory}
              />
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 px-4 mb-6">
                <img
                  src="/assets/images/dashboard/normalstar.webp"
                  alt="Typing indicator"
                  className="w-5 h-5 animate-spin"
                />
                <div className="flex gap-1">
                  {[0, 150, 300, 450, 600].map((delay) => (
                    <div
                      key={delay}
                      className="w-2 h-2 bg-[#8A88F3] rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            <div id="diagnostic-results">
              <ProgressBarsSection />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <ScrollReveal direction="left">
                <SummaryCard
                  title="Doing great"
                  items={glowItems}
                  bgColor="bg-[#378C78]"
                  iconImage="/assets/images/dashboard/doing.webp"
                />
              </ScrollReveal>
              <ScrollReveal direction="right">
                <SummaryCard
                  title="Growth areas"
                  items={growItems}
                  bgColor="bg-[#C56A55]"
                  iconImage="/assets/images/dashboard/growth.webp"
                />
              </ScrollReveal>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 my-6 md:my-8 max-w-2xl mx-auto">
              <button
                onClick={handleGeneratePathway}
                className="flex-1 px-5 py-3.5 bg-[#F5F5F5] text-[#578DDD] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#E5E5E5]"
              >
                Generate my Leadership Pathway
              </button>
              <button
                onClick={handleGoToDashboard}
                className="flex-1 py-3.5 px-5 bg-[#3D3D3D] text-[#F5F5F5] rounded-2xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D]"
              >
                Go to Dashboard
              </button>
            </div>

            {showPathwayView && (
              <>
                <ScrollReveal direction="up">
                  <div className="mb-8 mt-12 border-t pt-12 border-[#ECECEC]">
                    <p className="text-base md:text-lg text-[#3D3D3D] font-inter">
                      I'll create a personalized development plan focused on your
                      growth areas.
                    </p>
                  </div>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* Expert knowledge card */}
                  <ScrollReveal direction="left" delay={100}>
                    <div className="bg-white border-2 border-[#f7f7f7] rounded-2xl p-5 h-full">
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
                      <button
                        onClick={() => handleConversationSelect("session1")}
                        className=" px-4 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter-medium text-sm  transition-colors"
                      >
                        Start element
                      </button>
                    </div>
                  </ScrollReveal>
                  {/* Workbook card */}
                  <ScrollReveal direction="up" delay={200}>
                    <div
                      className={`bg-white border-2 border-[#f7f7f7] rounded-2xl p-5 h-full ${!completedSessions.includes(1) ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src="/assets/images/dashboard/workbook.webp"
                            alt="Workbook"
                            className="w-6 h-6"
                          />
                          <div>
                            <p
                              className={`text-xs font-inter-medium ${!completedSessions.includes(1) ? "text-[#9CA3AF]" : "text-[#3D3D3D]"}`}
                            >
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
                      <h3
                        className={`text-lg md:text-xl font-cormorant font-bold mb-3 ${!completedSessions.includes(1) ? "text-[#9CA3AF]" : "text-[#3D3D3D]"}`}
                      >
                        Reflective Practice
                      </h3>
                      <p
                        className={`text-sm font-inter mb-6 leading-relaxed ${!completedSessions.includes(1) ? "text-[#9CA3AF]" : "text-[#3D3D3D]/70"}`}
                      >
                        Small description about the element contents. Lorem ipsum
                        sit dolor amet avec consect.
                      </p>
                      {completedSessions.includes(1) ? (
                        <button
                          onClick={() => handleConversationSelect("session2")}
                          className=" px-4 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter-medium text-sm transition-colors"
                        >
                          Start element
                        </button>
                      ) : (
                        <button className=" px-4 py-3 bg-[#F5F5F5] text-[#9CA3AF] rounded-xl font-inter-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                          <Lock className="w-4 h-4" />
                          Locked
                        </button>
                      )}
                    </div>
                  </ScrollReveal>
                  {/* Application card */}
                  <ScrollReveal direction="right" delay={300}>
                    <div
                      className={`bg-white border-2 border-[#f7f7f7] rounded-2xl p-5 h-full ${!completedSessions.includes(2) ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src="/assets/images/dashboard/workbook.webp"
                            alt="Workbook"
                            className="w-6 h-6"
                          />
                          <div>
                            <p
                              className={`text-xs font-inter-medium ${!completedSessions.includes(2) ? "text-[#9CA3AF]" : "text-[#3D3D3D]"}`}
                            >
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
                      <h3
                        className={`text-lg md:text-xl font-cormorant font-bold mb-3 ${!completedSessions.includes(2) ? "text-[#9CA3AF]" : "text-[#3D3D3D]"}`}
                      >
                        Application
                      </h3>
                      <p
                        className={`text-sm font-inter mb-6 leading-relaxed ${!completedSessions.includes(2) ? "text-[#9CA3AF]" : "text-[#3D3D3D]/70"}`}
                      >
                        Small description about the element contents. Lorem ipsum
                        sit dolor amet avec consect.
                      </p>
                      {completedSessions.includes(2) ? (
                        <button
                          onClick={() => handleConversationSelect("session3")}
                          className=" px-4 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter-medium text-sm transition-colors"
                        >
                          Start element
                        </button>
                      ) : (
                        <button className=" px-4 py-3 bg-[#F5F5F5] text-[#9CA3AF] rounded-xl font-inter-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                          <Lock className="w-4 h-4" />
                          Locked
                        </button>
                      )}
                    </div>
                  </ScrollReveal>
                </div>
                <ScrollReveal direction="up" delay={400}>
                  <div className="bg-[#F5F5FF] rounded-xl p-4 md:p-6 mb-8">
                    <p className="text-base text-black font-inter mb-4">
                      We'll start with {domainLabel}. For that, I've scheduled 4
                      sessions for you:
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[1, 2, 3, 4].map((num) => (
                        <li key={num} className="flex items-start gap-3">
                          <span className="text-black font-bold">•</span>
                          <span className="text-base text-black font-inter">
                            Session {num}: {getSessionTitle(num)}{" "}
                            {num === 1 ? "(Common Understanding)" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-base text-black/70 font-inter mb-4 leading-relaxed">
                      Each session is designed to be conversational and practical,
                      building on real workplace scenarios.
                    </p>
                    <p className="text-base text-black/70 font-inter">
                      You would always have this pathway on the main dashboard so
                      you can work on all the points one by one.
                    </p>
                  </div>
                </ScrollReveal>
                <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
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
            )}
          </div>
        )}
        {selectedConversation !== "session1" &&
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
