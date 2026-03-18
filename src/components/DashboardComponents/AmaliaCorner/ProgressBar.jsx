import React, { useRef, useEffect } from "react";
const ProgressBar = ({
  label,
  yourScore,
  peersScore = 67,
  color,
  initialVectorPosition,
}) => {
  const colorClasses = {
    green: "bg-[#378C78]",
    blue: "bg-[#4299CA]",
    purple: "bg-[#855CC9]",
    pink: "bg-[#CC66A9]",
    orange: "bg-[#C56A55]",
    lightBlue: "bg-cyan-400",
  };
  const barColor = colorClasses[color] || colorClasses.green;
  const barRef = useRef(null);

  useEffect(() => {
    // Listeners removed as drag is disabled
  }, []);

  return (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm md:text-base font-inter-semibold text-[#3D3D3D]">
          {label}
        </span>
      </div>
      <div
        ref={barRef}
        className="relative h-3.5 bg-gray-100 rounded-full overflow-visible mt-3"
      >
        <div
          className={`${barColor} h-full rounded-full transition-all duration-1000 ease-out relative`}
          style={{
            width: `${yourScore}%`,
            willChange: "width",
            transform: "translateZ(0)",
          }}
        >
          {/* You Score at the end of the bar */}
          <div 
             className="absolute -top-7 right-0 transform translate-x-1/2 flex flex-col items-center"
             style={{ whiteSpace: 'nowrap' }}
          >
            <span className="text-xs md:text-sm font-inter-semibold text-[#6664D3]">
              You: {yourScore}
            </span>
          </div>
        </div>

        {/* Peer Marker and Score */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{
            left: `${peersScore}%`,
            willChange: "left",
            transition: "left 1s ease-out"
          }}
        >
          <div className="flex flex-col items-center">
            <span 
              className="text-[10px] md:text-xs font-inter-medium text-[#3D3D3D]/60 mb-1"
              style={{ whiteSpace: 'nowrap', position: 'absolute', bottom: '100%' }}
            >
              Peers: {peersScore}
            </span>
            <img
              src="/assets/images/dashboard/vector.webp"
              alt="Peer Marker"
              className="w-5 h-5 object-contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;