import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_AUTH_URL, authenticatedFetch } from "../../../services/api";

const DiagnosticDebriefModal = ({ isOpen, onClose, onGetDebrief }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [isUpdatingDebrief, setIsUpdatingDebrief] = useState(false);
  const [updateError, setUpdateError] = useState(null);

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

  const handleGetDebrief = async () => {
    if (isUpdatingDebrief) return;
    setIsUpdatingDebrief(true);
    setUpdateError(null);

    try {
      // Update server flag so dashboard can show "Amalia Debrief" next load.
      await authenticatedFetch(`${API_AUTH_URL}/debrief/`, {
        method: "PUT",
        body: JSON.stringify({ debrief_complete: true }),
      });

      localStorage.setItem("hasStartedDebrief", "true"); // fallback for current session
      if (onGetDebrief) onGetDebrief();

      onClose();
      navigate("/amalia-corner", { state: { animateInitial: true } });
    } catch (e) {
      console.error("Failed to update debrief flag:", e);
      setUpdateError("Could not start debrief. Please try again.");
      setIsUpdatingDebrief(false);
    }
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
              Get Your Diagnostic Debrief with Amalia          </h2>
            <p className="text-base sm:text-lg text-black/50 font-inter mb-6 max-w-xl mx-auto">
              Amalia can help you understand your results and
              provide personalized insights.
            </p>
            <div className="max-w-xl mx-auto">
              <button
                onClick={handleGetDebrief}
                disabled={isUpdatingDebrief}
                style={
                  isUpdatingDebrief
                    ? { opacity: 0.7, cursor: "not-allowed" }
                    : undefined
                }
                className="w-full px-6 py-3 bg-[#3D3D3D] text-[#F5F5F5] rounded-xl font-inter font-medium transition-colors text-base "
              >
                {isUpdatingDebrief ? "Starting..." : "Start Debrief"}
              </button>
              {updateError && (
                <p className="mt-3 text-sm text-red-600 font-inter" role="alert">
                  {updateError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiagnosticDebriefModal;

