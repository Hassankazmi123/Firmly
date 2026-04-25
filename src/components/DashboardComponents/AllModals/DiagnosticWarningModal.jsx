import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DiagnosticWarningModal = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div
          ref={modalRef}
          className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative pointer-events-auto transform transition-all duration-300 scale-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all z-20 shadow-sm"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 sm:p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#6664D3]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#6664D3] rounded-full flex items-center justify-center shadow-lg shadow-[#6664D3]/30">
                <img
                  src="/assets/images/dashboard/helpbtn.webp"
                  alt="diagnostic icon"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-cormorant font-bold text-[#1A1A1A] mb-4">
              Diagnostic Required
            </h2>

            <p className="text-base sm:text-lg text-[#3D3D3D]/70 font-inter mb-10 max-w-md leading-relaxed">
              To access your account settings, please first complete your <span className="font-semibold text-[#6664D3]">Firmly Diagnostic</span> assessment.

            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default DiagnosticWarningModal;
