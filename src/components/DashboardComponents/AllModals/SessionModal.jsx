import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SessionModal = ({ isOpen, onClose, sessionData }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

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

  if (!isOpen) return null;

  const defaultSession = {
    sessionNumber: "Session 1",
    title: "The Power of Empathetic Leadership",
    description: "Understand empathy as a cornerstone of inclusive leadership",
    duration: "30 minutes",
    icon: "/assets/images/dashboard/session1.webp",
  };

  const session = sessionData || defaultSession;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[299]"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
        <div ref={modalRef} className="relative w-full max-w-3xl">
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8  flex flex-col items-center text-center">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center">
                <img
                  src={session.icon}
                  alt="session icon"
                  className="w-20 h-20 lg:w-24 lg:h-24  object-contain"
                />
              </div>
            </div>
            <div className="text-center mb-1">
              <p className="text-xl lg:text-2xl text-black font-bold font-cormorant">
                {session.sessionNumber}
              </p>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cormorant font-bold text-black leading-tight">
                {session.title}
              </h2>
            </div>
            <div className="text-center mb-3">
              <p className="text-sm sm:text-base text-black/50 font-inter font-medium">
                {session.description}
              </p>
            </div>
            <div className="text-center mb-5">
              <p className="text-sm sm:text-base text-black/50 font-inter font-medium">
                Duration: {session.duration}
              </p>
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={() => {
                  sessionStorage.setItem("showSession1", "true");
                  sessionStorage.setItem("selectedConversation", "session1");
                  sessionStorage.setItem("startedFromDashboard", "true");
                  onClose();
                  navigate("/amalia-corner");
                }}
                className="w-full sm:w-auto px-6 py-3 bg-[#3D3D3D] text-white rounded-xl font-inter font-medium text-base transition-colors hover:bg-[#2D2D2D] active:scale-95"
              >
                Start session
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionModal;
