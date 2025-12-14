import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import AccountCreatedModal from "./AccountCreatedModal";

const CompleteProfileModal = ({ isOpen, onClose }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAccountCreated, setShowAccountCreated] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !firstName ||
      !lastName ||
      !age ||
      !experience ||
      !organization ||
      !jobRole
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (isNaN(age) || age < 18 || age > 100) {
      setError("Please enter a valid age between 18 and 100");
      return;
    }

    if (isNaN(experience) || experience < 0 || experience > 50) {
      setError("Please enter valid years of experience (0-50)");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowAccountCreated(true);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <OnboardingLayout>
          <div className="w-full min-h-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
            {/* Back button */}
            <button
              onClick={onClose}
              className="absolute top-16 sm:top-20 left-4 sm:left-6 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all z-30"
            >
              <svg
                className="w-6 h-6 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-lg relative">
              {/* Step indicator */}
              <div className="text-white/70 text-xs sm:text-sm font-inter mb-3 sm:mb-4">
                2 of 2
              </div>

              <h2 className="text-white text-xl sm:text-2xl font-semibold font-cormorant mb-2 sm:mb-3 text-left">
                Complete your profile
              </h2>

              <p className="text-white/80 text-xs sm:text-sm font-inter mb-4 sm:mb-6 leading-relaxed text-left">
                Let us know a little about yourself.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Profile Image Upload */}
                <div className="text-left">
                  <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2 sm:mb-3">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          className="w-7 h-7 sm:w-8 sm:h-8 text-white/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-white/80 text-xs sm:text-sm font-inter cursor-pointer hover:text-white active:scale-95 transition-all min-h-[44px] px-2">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3 sm:px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-3 sm:px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                {/* Age and Experience */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Age"
                      min="18"
                      max="100"
                      className="w-full px-3 sm:px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Years"
                      min="0"
                      max="50"
                      className="w-full px-3 sm:px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="text-left">
                  <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                    Current Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Enter your organization"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                    required
                  />
                </div>

                {/* Job Role */}
                <div className="text-left">
                  <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                    Current Job Role
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Enter job role"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                    required
                  />
                </div>

                {error && (
                  <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#F26767] text-white text-xs sm:text-sm font-inter text-left flex items-center gap-2 sm:gap-3">
                    <img
                      src="/assets/images/onboarding/error_icon.webp"
                      alt=""
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-[#7C3AED] font-medium rounded-full hover:bg-white/95 active:scale-95 transition-all font-inter text-sm disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {isLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-[#7C3AED]/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>Complete Profile</span>
                </button>
              </form>
            </div>
          </div>
        </OnboardingLayout>
      </div>

      <AccountCreatedModal
        isOpen={showAccountCreated}
        onClose={() => {
          setShowAccountCreated(false);
          onClose();
        }}
      />
    </>
  );
};

export default CompleteProfileModal;
