import React from "react";

const RadarChart = ({ data, peerData, highlightIndex = 0, onMetricClick }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const size = 500;
  const center = size / 2;
  const radius = size * 0.32;
  const levels = 5;

  // ... (rest of the component logic for calculations)
  const domains = [
    { key: "GOAL", label: "GOAL ORIENTATION", angle: -90 },
    { key: "RES", label: "RESILIENCE", angle: -30 },
    { key: "EMP", label: "EMPATHY", angle: 30 },
    { key: "BELONG", label: "WORKPLACE BELONGING", angle: 90 },
    { key: "ENG", label: "ENGAGEMENT", angle: 150 },
    { key: "SELF", label: "SELF-BELIEF", angle: 210 },
  ];

  const getPoint = (angle, r) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  // Background hexagons
  const backgroundHaxagons = [];
  for (let i = 1; i <= levels; i++) {
    const r = (radius / levels) * i;
    const points = domains
      .map((d) => {
        const p = getPoint(d.angle, r);
        return `${p.x},${p.y}`;
      })
      .join(" ");
    backgroundHaxagons.push(
      <polygon
        key={`level-${i}`}
        points={points}
        className="fill-none stroke-white/10 stroke-[0.5]"
      />
    );
  }

  // Axis lines
  const axisLines = domains.map((d, i) => {
    const p = getPoint(d.angle, radius);
    return (
      <line
        key={`axis-${i}`}
        x1={center}
        y1={center}
        x2={p.x}
        y2={p.y}
        className={`stroke-white/10 stroke-[1] ${i === 0 ? "stroke-dash-4" : ""
          }`}
        strokeDasharray={i === 0 ? "4" : "0"}
      />
    );
  });

  const verticalSeparator = (
    <line
      x1={center}
      y1={center - radius * 1.1}
      x2={center}
      y2={center + radius * 1.1}
      className="stroke-white/20 stroke-[1] stroke-dash-4"
      strokeDasharray="4"
    />
  );

  const todayPoints = domains.map((d) => {
    const score = data[d.key] || 0;
    const r = (radius * score) / 100;
    return getPoint(d.angle, r);
  });
  const todayPath = todayPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Peer Data path
  const peerPoints = domains.map((d) => {
    const score = peerData ? (peerData[d.key] || 0) : 0;
    const r = (radius * score) / 100;
    return getPoint(d.angle, r);
  });
  const peerPath = peerPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Highlight points
  const highlightTodayPoint = todayPoints[highlightIndex];
  const highlightPeerPoint = peerPoints[highlightIndex];

  return (
    <div className="relative flex items-center justify-center w-full h-full max-w-[600px] max-h-[600px] aspect-square">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Background Hexagons */}
        {backgroundHaxagons}

        {/* Axis Lines */}
        {axisLines}

        {/* Vertical Center Line */}
        {verticalSeparator}

        {/* Peer Data Shape (Dashed/Ghostly) */}
        {peerData && (
          <polygon
            points={peerPath}
            className="fill-none stroke-white/30 stroke-[1.5]"
            strokeDasharray="4,2"
          />
        )}

        {/* Today Data Shape (Yellow) */}
        <polygon
          points={todayPath}
          className="fill-[#FFCD4F]/20 stroke-[#FFCD4F] stroke-[2]"
          strokeLinejoin="round"
        />

        {/* Highlighted Data Point (Yellow Dot) */}
        <circle
          cx={highlightTodayPoint.x}
          cy={highlightTodayPoint.y}
          r="6"
          className="fill-[#FFCD4F] transition-all duration-300"
          style={{ filter: "drop-shadow(0 0 6px rgba(255, 205, 79, 0.8))" }}
        />

        {/* Peer Highlight Point (Subtle Dot) */}
        {peerData && (
          <circle
            cx={highlightPeerPoint.x}
            cy={highlightPeerPoint.y}
            r="4"
            className="fill-white/40 transition-all duration-300"
          />
        )}
      </svg>

      {/* Labels */}
      {domains.map((d, i) => {
        const p = getPoint(d.angle, radius * 1.35);
        const isActive = i === highlightIndex;
        const isHovered = i === hoveredIndex;
        const score = data[d.key] || 0;

        return (
          <div
            key={d.key}
            onClick={() => onMetricClick?.(i)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-center min-w-[120px] ${isActive || isHovered
              ? "bg-white/20 border-white/40 shadow-lg scale-110 z-50"
              : "bg-white/5 border-white/10 z-10"
              } backdrop-blur-md group hover:bg-white/30 transition-all`}
            style={{
              left: `${(p.x / size) * 100}%`,
              top: `${(p.y / size) * 100}%`,
            }}
          >
            <div className="flex flex-col items-center">
              <span className={`text-[9px] md:text-[11px] lg:text-[13px] font-bold tracking-[0.1em] transition-colors ${isActive || isHovered ? "text-white" : "text-white/60"
                }`}>
                {d.label}
              </span>
              {isHovered && (
                <div className="mt-1 flex items-baseline animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="text-sm md:text-lg font-bold text-[#FFCD4F] font-times-new-roman">
                    {score}
                  </span>
                  <span className="text-[8px] md:text-[10px] text-white/40 ml-0.5">/100</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RadarChart;
