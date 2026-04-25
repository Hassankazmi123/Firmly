import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const StartConversationModal = ({ isOpen, onClose, onStartChat }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
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

  const handleNormalChat = () => {
    if (onStartChat) {
      onStartChat("normal");
    }
    navigate("/dashboard/normal-chat");
    onClose();
  };

  const handleSafeSpaceChat = () => {
    if (onStartChat) {
      onStartChat("safe-space");
    }
    navigate("/dashboard/safe-space-chat");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[299] backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 z-[300] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden my-auto sm:my-0 max-h-[90vh] sm:max-h-[95vh] flex flex-col"
        >
          <div className="bg-[#6664D3] px-4 sm:px-8 py-6  relative overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-20"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: "url(/assets/images/dashboard/conbg.webp)",
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-cormorant font-bold text-[#FFFFFF] mb-1">
                Start a Conversation
              </h2>
              <p className="text-xs sm:text-base text-[#FFFFFF]/60 font-inter font-medium lg:mb-0 mb-2">
                Choose how you'd like to chat with Amalia.
              </p>
            </div>
          </div>
          <div className="p-4 sm:p-8 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white  rounded-2xl lg:p-6 p-4 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div
                  className="absolute top-0 left-0 right-0 h-12 bg-cover bg-center bg-no-repeat rounded-t-2xl"
                  style={{
                    backgroundImage: "url(/assets/images/dashboard/conbg.webp)",
                    backgroundColor: "#e8e8e8",
                  }}
                ></div>
                <div className="mt-14">
                  <div className="flex flex-row gap-2 items-start justify-between">
                    <div>
                      <h3 className="lg:text-xl text-md font-bold font-cormorant text-black mb-2">
                        Normal Chat
                      </h3>
                      <p className="text-xs text-[#3D3D3D]/60 mb-3 font-inter font-regular leading-relaxed">
                        Standard coaching conversation. Messages persist so you
                        can revisit insights anytime.
                      </p>
                      <p className="text-xs text-[#3D3D3D]/60 mb-5 font-inter font-regular">
                        History saved to your session.
                      </p>
                    </div>
                    <img
                      src="/assets/images/dashboard/constar.webp"
                      alt="star icon"
                      className="lg:w-10 lg:h-10 w-8 h-8"
                    />
                  </div>
                  <div className="flex  justify-end mt-4">
                    <button
                      onClick={handleNormalChat}
                      className=" lg:px-5 px-3 lg:py-3 py-2 bg-[#f5f5f5] text-[#807EF1] lg:rounded-xl rounded-md font-medium  transition-colors text-xs sm:text-base hover:bg-[#e5e5e5]"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white  rounded-2xl lg:p-6 p-4 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div
                  className="absolute top-0 left-0 right-0 h-12 bg-cover bg-center bg-no-repeat rounded-t-2xl"
                  style={{
                    backgroundImage: "url(/assets/images/dashboard/conbg.webp)",
                    backgroundColor: "#e8e8e8",
                  }}
                ></div>
                <div className="mt-14">
                  <div className="flex flex-row gap-2 items-start justify-between">
                    <div>
                      <h3 className="lg:text-xl text-md font-bold font-cormorant text-black mb-2">
                        Safe Space (Incognito mode){" "}
                      </h3>
                      <p className="text-xs text-[#3D3D3D]/60 mb-3 font-inter font-regular leading-relaxed">
                        Incognito mode for sensitive topics.
                      </p>
                      <p className="text-xs text-[#3D3D3D]/60 mb-5 font-inter font-regular">
                        No history will be saved .
                      </p>
                    </div>
                    <img
                      src="/assets/images/dashboard/constar.webp"
                      alt="star icon"
                      className="lg:w-10 lg:h-10 w-8 h-8"
                    />
                  </div>
                  <div className="flex  justify-end mt-4">
                    <button
                      onClick={handleSafeSpaceChat}
                      className=" lg:px-5 px-3 lg:py-3 py-2 bg-[#f5f5f5] text-[#807EF1] lg:rounded-xl rounded-md font-medium  transition-colors text-xs sm:text-base hover:bg-[#e5e5e5]"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartConversationModal;
