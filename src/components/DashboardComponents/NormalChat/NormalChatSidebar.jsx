import React, { useState } from "react";

const NormalChatSidebar = ({
  isCollapsed,
  onToggleCollapse,
  threads = [],
  currentThread,
  onSelectThread,
  onResetChat,
  onCloseThread,
  onCreateNewThread, // Added prop
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter threads based on search query
  const filteredThreads = threads.filter(thread => {
    const title = thread.title || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleNewChat = () => {
    if (onCreateNewThread) {
      onCreateNewThread();
    } else if (onResetChat) {
      onResetChat();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleString('en-US', options).toUpperCase();
    } catch (err) {
      return dateString;
    }
  };

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
          } fixed md:relative z-50 md:z-auto flex flex-col h-full`}
        style={{ maxHeight: "100%" }}
      >
        <div className="px-5 py-3 flex items-center justify-between  mt-4">
          <h2 className="text-xl md:text-2xl font-semibold text-black font-cormorant ">
            All Conversations
          </h2>
          <button
            onClick={onToggleCollapse}
            className="text-gray-600 hover:text-gray-900 transition-colors"
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
        <div className="p-3 flex flex-col gap-3">
          {/* Search Section */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 font-inter font-medium text-[#9E9CAE]  py-3 bg-transparent border-[1px] border-[#ECECEC] rounded-xl focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] text-sm md:text-base"
            />
          </div>

          {/* New Chat Section */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-4 py-3 border-[1px] border-[#ECECEC] rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <span className="font-inter font-medium text-[#9E9CAE] text-sm md:text-base group-hover:text-gray-600 transition-colors">
              New Chat
            </span>
            <svg
              className="w-5 h-5 text-[#9E9CAE] group-hover:text-gray-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
        <div className="px-3 py-3 mb-2">
          <h3 className="text-xs md:text-sm font-inter font-semibold text-black/30 uppercase tracking-wide">
            Recent
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#6664D3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-[#3D3D3D]/60 font-inter">
                {searchQuery ? "No conversations found" : "No conversations yet. Start a new chat!"}
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`rounded-xl border border-[#ECECEC] p-3 mb-2 cursor-pointer transition-colors ${currentThread?.id === thread.id ? "bg-[#F5F5F5]" : "bg-white hover:bg-gray-50"
                  }`}
                onClick={() => onSelectThread(thread)}
              >
                <p className="text-xs text-[#3D3D3D]/60 mb-1">
                  {formatDate(thread.created_at || thread.updated_at)}
                </p>
                <p className="text-sm md:text-base font-medium text-[#3D3D3D] font-inter">
                  {thread.title || "Untitled Chat"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NormalChatSidebar;
