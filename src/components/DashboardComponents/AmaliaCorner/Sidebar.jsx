import React, { useState } from "react";
const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
  showSession1 = false,
  showSession2 = false,
  showSession3 = false,
  showSession4 = false,
  onConversationSelect,
  selectedConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getDomain = () => {
    const rawDomain = sessionStorage.getItem("currentPathwayDomain");
    if (!rawDomain || rawDomain === "null" || rawDomain === "undefined") return "emp";
    const d = rawDomain.toLowerCase();
    if (d.includes("resilience") || d.includes("resilien") || d.includes(" res")) return "res";
    if (d.includes("goal")) return "goal";
    if (d.includes("engagement") || d.includes("engage")) return "eng";
    if (d.includes("empathy") || d.includes("emp")) return "emp";
    return "emp";
  };

  const domain = getDomain();

  const getPathwayLabel = () => {
    switch (domain) {
      case "goal": return "Leadership Goal Setting";
      case "res": return "Resilience";
      case "eng": return "Engagement";
      default: return "Cultivating Empathy";
    }
  };

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50  z-40 md:hidden"
          onClick={onToggleCollapse}
        />
      )}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex fixed left-0 top-4 z-50 bg-white border border-[#ECECEC] rounded-r-2xl p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Open sidebar"
          title="Open sidebar to view all conversations"
        >
          <svg
            className="w-5 h-5"
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
      )}
      <div
        className={`bg-white rounded-2xl transition-all duration-300 ${isCollapsed
          ? "w-0 overflow-hidden -translate-x-full md:translate-x-0"
          : "w-3/4 md:w-1/4 lg:w-1/5 translate-x-0 mr-4"
          } fixed md:relative z-50 md:z-auto flex flex-col h-screen`}
      >
        <div className="px-5 py-3 flex items-center justify-between mt-4">
          <h2 className="text-xl md:text-2xl font-semibold text-black font-cormorant">
            {!isCollapsed && "All Conversations"}
          </h2>
          <button
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-900 transition-colors "
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
        <div className="p-3">
          <input
            type="text"
            placeholder="Search conversation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 text-[#9E9CAE] font-inter py-3 bg-transparent border-[1px] border-[#ECECEC] rounded-xl  focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] text-sm md:text-base"
          />
        </div>
        <div className="px-3  py-3 mb-2">
          <h3 className="text-xs md:text-sm font-semibold text-black/30 uppercase tracking-wide">
            Recent
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {showSession1 && (
            <>
              <div
                onClick={() =>
                  onConversationSelect &&
                  onConversationSelect("cultivating-empathy")
                }
                className={`rounded-xl border border-[#ECECEC] p-3 mb-2 cursor-pointer transition-colors ${selectedConversation === "cultivating-empathy"
                  ? "bg-[#F5F5F5]"
                  : "bg-[#F5F5F5] hover:bg-[#E5E5E5]"
                  }`}
              >
                <p className="text-xs text-[#3D3D3D]/60 mb-1">
                  JUN 09, 2025 - 11:18 am
                </p>
                <p className="text-sm md:text-lg font-medium text-[#3D3D3D] font-inter">
                  {getPathwayLabel()}
                </p>
              </div>
              <div
                onClick={() =>
                  onConversationSelect && onConversationSelect("session1")
                }
                className={`rounded-xl border border-[#ECECEC] p-3 mb-2 ml-4 cursor-pointer transition-colors ${selectedConversation === "session1"
                  ? "bg-[#E8E8E8]"
                  : "bg-[#F5F5F5] hover:bg-[#E5E5E5]"
                  }`}
              >
                <p className="text-xs md:text-sm text-[#3D3D3D] font-inter">
                  • Session 1
                </p>
              </div>
              {showSession2 && (
                <div
                  onClick={() =>
                    onConversationSelect && onConversationSelect("session2")
                  }
                  className={`rounded-xl border border-[#ECECEC] p-3 mb-2 ml-4 cursor-pointer transition-colors ${selectedConversation === "session2"
                    ? "bg-[#E8E8E8]"
                    : "bg-[#F5F5F5] hover:bg-[#E5E5E5]"
                    }`}
                >
                  <p className="text-xs md:text-sm text-[#3D3D3D] font-inter">
                    • Session 2
                  </p>
                </div>
              )}
              {showSession3 && (
                <div
                  onClick={() =>
                    onConversationSelect && onConversationSelect("session3")
                  }
                  className={`rounded-xl border border-[#ECECEC] p-3 mb-2 ml-4 cursor-pointer transition-colors ${selectedConversation === "session3"
                    ? "bg-[#E8E8E8]"
                    : "bg-[#F5F5F5] hover:bg-[#E5E5E5]"
                    }`}
                >
                  <p className="text-xs md:text-sm text-[#3D3D3D] font-inter">
                    • Session 3
                  </p>
                </div>
              )}
              {showSession4 && (
                <div
                  onClick={() =>
                    onConversationSelect && onConversationSelect("session4")
                  }
                  className={`rounded-xl border border-[#ECECEC] p-3 mb-2 ml-4 cursor-pointer transition-colors ${selectedConversation === "session4"
                    ? "bg-[#E8E8E8]"
                    : "bg-[#F5F5F5] hover:bg-[#E5E5E5]"
                    }`}
                >
                  <p className="text-xs md:text-sm text-[#3D3D3D] font-inter">
                    • Session 4
                  </p>
                </div>
              )}
            </>
          )}
          <div
            onClick={() =>
              onConversationSelect && onConversationSelect("diagnostic")
            }
            className={`rounded-xl border border-[#ECECEC] p-3 mb-2 cursor-pointer transition-colors ${selectedConversation === "diagnostic"
              ? "bg-[#F5F5F5]"
              : "bg-[#F5F5F5] hover:bg-[#E5E5E5]"
              }`}
          >
            <p className="text-xs text-[#3D3D3D]/60 mb-1">
              JUN 08, 2025 - 03:52 pm
            </p>
            <p className="text-sm md:text-lg font-medium text-[#3D3D3D] font-inter">
              Diagnostic Debrief
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
