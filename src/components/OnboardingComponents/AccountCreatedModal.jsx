import React from "react";
import { useNavigate } from "react-router-dom";

const AccountCreatedModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate("/diagnostic");
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full mx-auto p-6 sm:p-8 md:p-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src="/assets/images/onboarding/Swal_Icon.webp"
            alt="Success"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            onError={(e) => {
              console.error("Image failed to load");
              console.error("Attempted path:", e.target.src);
            }}
            onLoad={() => {
              console.log("Swal icon loaded successfully!");
            }}
          />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 font-cormorant px-2">
          Account Created Successfully
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 font-inter leading-relaxed px-2">
          Your profile has been set up. You're ready to start your journey with
          Firmly.
        </p>

        {/* Button */}
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto bg-[#374151] text-white px-8 py-3 rounded-full font-medium hover:bg-[#4B5563] active:scale-95 transition-all font-inter text-sm sm:text-base min-h-[48px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AccountCreatedModal;
