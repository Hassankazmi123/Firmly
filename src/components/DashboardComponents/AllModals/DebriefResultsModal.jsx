import React, { useEffect, useRef, useState } from "react";
import { assessmentService } from "../../../services/assessment";

const domainMeta = {
    GOAL: {
        label: "Goal Orientation",
        description: "The tendency to set goals and make plans ahead of time.",
        color: "#6664D3",
        bg: "rgba(102,100,211,0.10)",
        icon: "🎯",
    },
    BELONG: {
        label: "Workplace Belonging",
        description: "The sense of being accepted and valued in the workplace.",
        color: "#378C78",
        bg: "rgba(55,140,120,0.10)",
        icon: "🤝",
    },
    ENG: {
        label: "Engagement",
        description: "Level of involvement, enthusiasm, and commitment at work.",
        color: "#5C91E0",
        bg: "rgba(92,145,224,0.10)",
        icon: "⚡",
    },
    RES: {
        label: "Resilience",
        description: "Capacity to recover quickly from difficulties and adapt.",
        color: "#D4A843",
        bg: "rgba(212,168,67,0.10)",
        icon: "💪",
    },
    SELF: {
        label: "Self-Belief",
        description: "Confidence in one's own abilities and judgment.",
        color: "#C56A55",
        bg: "rgba(197,106,85,0.10)",
        icon: "✨",
    },
    EMP: {
        label: "Empathy",
        description: "Ability to understand and share the feelings of others.",
        color: "#8B5CF6",
        bg: "rgba(139,92,246,0.10)",
        icon: "💜",
    },
};

const ScoreBar = ({ score, color }) => (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{
                width: `${score}%`,
                backgroundColor: color,
            }}
        />
    </div>
);

const DomainCard = ({ domain, percent, index }) => {
    const meta = domainMeta[domain] || {
        label: domain,
        description: "",
        color: "#6664D3",
        bg: "rgba(102,100,211,0.10)",
        icon: "📊",
    };
    const score = Math.round(parseFloat(percent));

    const getScoreLabel = (s) => {
        if (s >= 75) return { text: "Thriving", color: "#378C78" };
        if (s >= 50) return { text: "Balanced", color: "#5C91E0" };
        if (s >= 30) return { text: "Growing", color: "#D4A843" };
        return { text: "Needs Focus", color: "#C56A55" };
    };

    const scoreLabel = getScoreLabel(score);

    return (
        <div
            className="rounded-2xl p-5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5 duration-200"
            style={{
                background: meta.bg,
                border: `1.5px solid ${meta.color}22`,
                animationDelay: `${index * 80}ms`,
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <span className="font-cormorant font-bold text-[#3D3D3D] text-base lg:text-lg leading-tight">
                        {meta.label}
                    </span>
                </div>
                <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full font-inter"
                    style={{ background: `${meta.color}18`, color: meta.color }}
                >
                    {scoreLabel.text}
                </span>
            </div>
            <p className="text-xs text-[#3D3D3D]/55 font-inter leading-relaxed">
                {meta.description}
            </p>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <ScoreBar score={score} color={meta.color} />
                </div>
                <span
                    className="text-sm font-bold font-inter min-w-[38px] text-right"
                    style={{ color: meta.color }}
                >
                    {score}%
                </span>
            </div>
        </div>
    );
};

const DebriefResultsModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const [state, setState] = useState("idle"); // idle | loading | success | error
    const [results, setResults] = useState(null);
    const [briefMessage, setBriefMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Lock scroll
    useEffect(() => {
        if (!isOpen) return;
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
    }, [isOpen]);

    // Close handlers
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    // Fetch data when modal opens
    useEffect(() => {
        if (!isOpen) return;
        setState("loading");
        setBriefMessage("");
        setErrorMsg("");
        setResults(null);

        const run = async () => {
            try {
                const assessmentId = localStorage.getItem("assessmentId");
                if (!assessmentId) throw new Error("No assessment ID found.");

                // Call generate-brief — API returns { text, dimensions, glow, grow }
                let brief = null;
                try {
                    brief = await assessmentService.generateBrief(assessmentId);
                    console.log("generateBrief response:", brief);
                } catch (e) {
                    // Non-fatal – brief generation might fail but we can still show results
                    console.warn("generateBrief failed:", e);
                }

                // Fetch results to display domains
                const data = await assessmentService.getResults(assessmentId);

                // Merge glow/grow from brief into results if results doesn't have them
                if (brief && data) {
                    if (!data.glow && Array.isArray(brief.glow)) data.glow = brief.glow;
                    if (!data.grow && Array.isArray(brief.grow)) data.grow = brief.grow;
                }
                setResults(data);

                // Extract the text message — API shape is { text, dimensions, glow, grow }
                const msg = brief?.text || brief?.message || brief?.brief || brief?.summary || "";
                if (typeof msg === "string" && msg.trim()) {
                    setBriefMessage(msg.trim());
                }
                setState("success");
            } catch (err) {
                console.error("DebriefModal error:", err);
                setErrorMsg(err.message || "Something went wrong. Please try again.");
                setState("error");
            }
        };

        run();
    }, [isOpen]);

    if (!isOpen) return null;

    const domains = results?.domains || [];
    const overallScore =
        domains.length > 0
            ? Math.round(
                domains.reduce((acc, d) => acc + parseFloat(d.percent_0_100 || 0), 0) /
                domains.length
            )
            : null;

    // Safely extract domain code string from array items (could be string or object)
    const toCode = (item) => (typeof item === "string" ? item : item?.domain || item?.code || String(item));
    const glowCodes = (results?.glow || []).map(toCode).filter(Boolean);
    const growCodes = (results?.grow || []).map(toCode).filter(Boolean);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-[299] backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
                <div
                    ref={modalRef}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col"
                    style={{ maxHeight: "92vh" }}
                >
                    {/* Header */}
                    <div className="relative bg-[#6664D3] px-6 sm:px-8 py-6 overflow-hidden flex-shrink-0">
                        {/* decorative blobs */}
                        <div
                            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
                            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
                        />
                        <div
                            className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
                            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
                        />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
                            aria-label="Close modal"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative z-10 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <img
                                    src="/assets/images/dashboard/starpurple.webp"
                                    alt="star"
                                    className="w-5 h-5"
                                    style={{ filter: "brightness(0) invert(1)" }}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-cormorant font-bold text-white leading-tight">
                                    Your Diagnostic Debrief
                                </h2>
                                <p className="text-white/70 text-sm font-inter mt-0.5">
                                    Assessment results across all six domains
                                </p>
                            </div>
                        </div>

                        {overallScore !== null && state === "success" && (
                            <div className="relative z-10 mt-5 flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-5 py-3">
                                <div>
                                    <p className="text-white/60 text-xs font-inter uppercase tracking-wider">
                                        Overall Score
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white font-cormorant">
                                            {overallScore}
                                        </span>
                                        <span className="text-white/40 text-lg font-inter">/100</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="h-2.5 rounded-full transition-all duration-1000 ease-out bg-white"
                                            style={{ width: `${overallScore}%` }}
                                        />
                                    </div>
                                    <p className="text-white/50 text-xs font-inter mt-1">
                                        {overallScore >= 75
                                            ? "Excellent performance across your domains"
                                            : overallScore >= 50
                                                ? "Balanced performance — keep pushing"
                                                : "Room to grow — Amalia can help"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                        {/* Loading */}
                        {state === "loading" && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-[#6664D3]/20 border-t-[#6664D3] animate-spin" />
                                <p className="text-[#3D3D3D]/60 font-inter text-sm">
                                    Generating your diagnostic brief…
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {state === "error" && (
                            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[#3D3D3D] font-cormorant font-bold text-lg mb-1">
                                        Unable to load results
                                    </p>
                                    <p className="text-[#3D3D3D]/50 font-inter text-sm max-w-xs">
                                        {errorMsg}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="mt-2 px-6 py-2.5 bg-[#3D3D3D] text-white rounded-xl font-inter text-sm hover:bg-[#2D2D2D] transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}

                        {/* Success */}
                        {state === "success" && (
                            <div className="space-y-6">
                                {/* Brief message if available */}
                                {briefMessage && (
                                    <div className="bg-[#6664D3]/6 border border-[#6664D3]/15 rounded-2xl p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-[#6664D3] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <img
                                                    src="/assets/images/dashboard/starpurple.webp"
                                                    alt="amalia"
                                                    className="w-4 h-4"
                                                    style={{ filter: "brightness(0) invert(1)" }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[#6664D3] font-inter font-semibold text-sm mb-1">
                                                    Amalia's Insight
                                                </p>
                                                <p className="text-[#3D3D3D]/70 font-inter text-sm leading-relaxed">
                                                    {briefMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Domain results */}
                                {domains.length > 0 ? (
                                    <>
                                        <div>
                                            <h3 className="font-cormorant font-bold text-[#3D3D3D] text-lg mb-1">
                                                Domain Breakdown
                                            </h3>
                                            <p className="text-[#3D3D3D]/50 text-sm font-inter">
                                                Your scores across all six research-backed dimensions
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {domains.map((d, i) => (
                                                <DomainCard
                                                    key={d.domain}
                                                    domain={d.domain}
                                                    percent={d.percent_0_100}
                                                    index={i}
                                                />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-[#3D3D3D]/50 font-inter text-sm">
                                            No domain data available at this time.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DebriefResultsModal;
