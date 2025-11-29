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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <img
            src="/assets/images/onboarding/Swal_Icon.webp"
            alt="Success"
            className="w-20 h-20 object-contain"
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-cormorant">
          Account Created Successfully
        </h2>

        {/* Description */}
        <p className="text-base text-gray-600 mb-8 font-inter leading-relaxed">
          Your profile has been set up. You're ready to start your journey with
          Firmly.
        </p>

        {/* Button */}
        <button
          onClick={handleContinue}
          className="bg-[#374151] text-white px-8 py-3 rounded-full font-medium hover:bg-[#4B5563] transition-colors font-inter"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AccountCreatedModal;
