import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LeadershipPathwayModal = ({ isOpen, onClose, onGenerate }) => {
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

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[299] backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
        >
          <div className="p-8  flex flex-col items-center text-center">
            <button className=" w-16 h-16 sm:w-24 sm:h-24 bg-[#6664D3]  active:scale-95 rounded-full flex items-center justify-center  hover:shadow-[#8A7BBF]/50 transition-all duration-300 flex-shrink-0 group">
              <img
                src="/assets/images/dashboard/helpbtn.webp"
                alt="action icon"
                className="h-10 w-10 sm:h-14 sm:w-14 transition-transform duration-300 group-hover:scale-110"
              />
            </button>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-cormorant font-semibold text-black my-4">
              Get a Leadership Pathway
            </h2>
            <p className="text-base sm:text-lg text-black/50 font-inter mb-6 max-w-xl mx-auto">
              Amalia can help you improve your Growth Areas by generating a
              Leadership Pathway for you
            </p>
            <div className="max-w-xl mx-auto">
              <button
                onClick={handleGenerate}
                className="w-full px-6 py-3 bg-[#3D3D3D] text-[#F5F5F5] rounded-xl font-inter font-medium transition-colors text-base "
              >
                Generate my Leadership Pathway
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadershipPathwayModal;