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
const AmaliaCornerLayout = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showPathwayView, setShowPathwayView] = useState(false);
  const [showSession1, setShowSession1] = useState(false);
  const [showSession2, setShowSession2] = useState(false);
  const [showSession3, setShowSession3] = useState(false);
  const [showSession4, setShowSession4] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
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
    const shouldShowPathway = sessionStorage.getItem("showLeadershipPathway");
    if (shouldShowPathway === "true") {
      setShowPathwayView(true);
      sessionStorage.removeItem("showLeadershipPathway");
    }

    const shouldShowSession1 = sessionStorage.getItem("showSession1");
    if (shouldShowSession1 === "true") {
      setShowSession1(true);
      setShowSession2(false);
      setShowSession3(false);
      setShowSession4(false);
      setSelectedConversation("session1");
      sessionStorage.removeItem("showSession1");
    } else {
      const shouldShowSession2 = sessionStorage.getItem("showSession2");
      if (shouldShowSession2 === "true") {
        setShowSession1(true);
        setShowSession2(true);
        setShowSession3(false);
        setShowSession4(false);
        setSelectedConversation("session2");
        sessionStorage.removeItem("showSession2");
      } else {
        const shouldShowSession3 = sessionStorage.getItem("showSession3");
        if (shouldShowSession3 === "true") {
          setShowSession1(true);
          setShowSession2(true);
          setShowSession3(true);
          setShowSession4(false);
          setSelectedConversation("session3");
          sessionStorage.removeItem("showSession3");
        } else {
          const shouldShowSession4 = sessionStorage.getItem("showSession4");
          if (shouldShowSession4 === "true") {
            setShowSession1(true);
            setShowSession2(true);
            setShowSession3(true);
            setShowSession4(true);
            setSelectedConversation("session4");
            sessionStorage.removeItem("showSession4");
          } else {
            setSelectedConversation("diagnostic");
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    const detectDomain = async () => {
      const existingDomain = sessionStorage.getItem("currentPathwayDomain");
      if (!existingDomain || existingDomain === "null" || existingDomain === "undefined") {
        try {
          const response = await pathwayService.startPathway();
          if (response && response.domain) {
            sessionStorage.setItem("currentPathwayDomain", response.domain);
          }
        } catch (e) {
          console.error("Auto domain detection failed:", e);
        }
      }
    };
    detectDomain();
  }, []);

  const handleConversationSelect = (conversationId) => {
    if (conversationId === "cultivating-empathy") {
      if (showSession1) {
        setShowSession1(false);
        setShowSession2(false);
        setShowSession3(false);
        setShowSession4(false);
        setSelectedConversation("diagnostic");
      } else {
        setShowSession1(true);
        setSelectedConversation("session1");
      }
    } else if (conversationId === "diagnostic") {
      setSelectedConversation("diagnostic");
    } else if (conversationId === "session1") {
      setShowSession1(true);
      setSelectedConversation("session1");
    } else if (conversationId === "session2") {
      setShowSession1(true);
      setShowSession2(true);
      setSelectedConversation("session2");
    } else if (conversationId === "session3") {
      setShowSession1(true);
      setShowSession2(true);
      setShowSession3(true);
      setSelectedConversation("session3");
    } else if (conversationId === "session4") {
      setShowSession1(true);
      setShowSession2(true);
      setShowSession3(true);
      setShowSession4(true);
      setSelectedConversation("session4");
    }
  };
  const initialMessage = (
    <>
      Hi, Lily, <br /> I'm so glad you decided to dive deeper into your results
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
      if (response && response.domain) {
        sessionStorage.setItem("currentPathwayDomain", response.domain);
      }
    } catch (e) {
      console.error("Failed to start pathway from layout:", e);
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
    navigate("/dashboard");
  };

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), type: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

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
      } else {
        await pathwayService.sendEmpathyMessage(text, "CORE");
        historyData = await pathwayService.getEmpathyHistory();
      }

      const formatted = (Array.isArray(historyData) ? historyData : (historyData?.messages || [])).map((msg, idx) => ({
        id: msg.id || idx,
        type: (msg.sender && msg.sender.toLowerCase().trim() === 'user') ? 'user' : 'amalia',
        content: msg.text || msg.content
      }));

      if (formatted.length > 0) {
        setMessages(formatted);
      }
    } catch (error) {
      console.error("Failed to send message in diagnostic view:", error);
    }
  };

  const getDomain = () => {
    const rawDomain = sessionStorage.getItem("currentPathwayDomain");
    if (!rawDomain || rawDomain === "null" || rawDomain === "undefined") return "emp";
    const d = rawDomain.toLowerCase();
    if (d.includes("resilience") || d.includes("resilien") || d.includes(" res")) return "res";
    if (d.includes("goal")) return "goal";
    if (d.includes("engagement") || d.includes("engage")) return "eng";
    if (d.includes("self")) return "self";
    if (d.includes("empathy") || d.includes("emp")) return "emp";
    return "emp";
  };

  const handleStartSession = () => {
    sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
    sessionStorage.setItem("fromStartSession", "true");
    navigate("/dashboard");
  };

  const domain = getDomain();

  const getDomainLabel = () => {
    switch (domain) {
      case "goal": return "Goal Setting";
      case "res": return "Resilience";
      case "eng": return "Engagement";
      case "self": return "Self Awareness";
      default: return "Empathy";
    }
  };

  const glowItems = [
    { abbreviation: "GOA", label: "Goal Orientation", score: 96 },
    { abbreviation: "WOR", label: "Workplace Belonging", score: 89 },
    { abbreviation: "RES", label: "Resilience", score: 87 },
  ];

  const getGrowItems = () => {
    switch (domain) {
      case "goal": return [
        { abbreviation: "GOA", label: "Goal Orientation", score: 32 },
        { abbreviation: "ENG", label: "Engagement", score: 24 },
        { abbreviation: "SEL", label: "Self-belief", score: 22 },
      ];
      case "res": return [
        { abbreviation: "RES", label: "Resilience", score: 32 },
        { abbreviation: "ENG", label: "Engagement", score: 24 },
        { abbreviation: "SEL", label: "Self-belief", score: 22 },
      ];
      case "eng": return [
        { abbreviation: "ENG", label: "Engagement", score: 32 },
        { abbreviation: "SEL", label: "Self-belief", score: 24 },
        { abbreviation: "WOR", label: "Workplace Belonging", score: 22 },
      ];
      case "self": return [
        { abbreviation: "SEL", label: "Self Awareness", score: 32 },
        { abbreviation: "EMOT", label: "Emotional Reg", score: 24 },
        { abbreviation: "SOC", label: "Social", score: 22 },
      ];
      default: return [
        { abbreviation: "EMP", label: "Empathy", score: 32 },
        { abbreviation: "ENG", label: "Engagement", score: 24 },
        { abbreviation: "SEL", label: "Self-belief", score: 22 },
      ];
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
      default:
        if (num === 1) return "The Power of Empathetic Leadership";
        if (num === 2) return "Reflective Practice - Empathy in Action";
        if (num === 3) return "The Empathy Toolkit - Practical Applications";
        if (num === 4) return "Integration and Forward Movement";
    }
    return "";
  };

  const domainLabel = getDomainLabel();
  const growItems = getGrowItems();
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
                    <span className="font-semibold">{domainLabel}</span>. For that,
                    I've scheduled 4 sessions for you:
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
        {!showPathwayView && selectedConversation !== "session1" && selectedConversation !== "session2" && selectedConversation !== "session3" && selectedConversation !== "session4" && (
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
