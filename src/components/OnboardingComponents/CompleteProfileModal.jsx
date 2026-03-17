import React, { useState } from "react";
import OnboardingLayout from "./OnboardingLayout";
import AccountCreatedModal from "./AccountCreatedModal";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;

const CompleteProfileModal = ({ isOpen, onClose, authTokens }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [jobRoleError, setJobRoleError] = useState("");
  const [showAccountCreated, setShowAccountCreated] = useState(() => {
    return localStorage.getItem("onboardingShowAccountCreated") === "true";
  });

  const handleLettersOnly = (setter, setErr) => (e) => {
    const raw = e.target.value;
    if (/[0-9]/.test(raw)) {
      setErr("Numbers are not allowed in this field");
    } else {
      setErr("");
    }
    setter(raw.replace(/[0-9]/g, ""));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
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

    if (!/^[A-Za-z\s]+$/.test(firstName) || !/^[A-Za-z\s]+$/.test(lastName)) {
      setError("First and Last name should contain characters only");
      return;
    }

    // Age validation (Numbers only)
    if (!/^\d+$/.test(age) || age < 18 || age > 100) {
      setError("Please enter a valid age (numbers only, 18-100)");
      return;
    }

    // Experience validation (Numbers only)
    if (!/^\d+$/.test(experience) || experience < 0 || experience > 50) {
      setError("Please enter valid years of experience (numbers only, 0-50)");
      return;
    }

    // Organization and Job Role validation (Characters and Numbers)
    if (!/^[A-Za-z0-9\s]+$/.test(organization)) {
      setError("Organization should contain characters and numbers only");
      return;
    }

    if (!/^[A-Za-z0-9\s]+$/.test(jobRole)) {
      setError("Job Role should contain characters and numbers only");
      return;
    }

    if (!authTokens || !authTokens.access) {
      setError("Authentication required. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("age", parseInt(age));
      formData.append("years_of_experience", parseInt(experience));
      formData.append("job_role", jobRole);
      formData.append("organization", organization);

      if (selectedFile) {
        formData.append("profile_image", selectedFile);
      }

      const response = await fetch(`${API_AUTH_URL}/complete-profile/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          // Content-Type is not set for FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.first_name) {
          setError(
            Array.isArray(data.first_name)
              ? data.first_name[0]
              : data.first_name,
          );
        } else if (data.last_name) {
          setError(
            Array.isArray(data.last_name) ? data.last_name[0] : data.last_name,
          );
        } else if (data.age) {
          setError(Array.isArray(data.age) ? data.age[0] : data.age);
        } else if (data.years_of_experience) {
          setError(
            Array.isArray(data.years_of_experience)
              ? data.years_of_experience[0]
              : data.years_of_experience,
          );
        } else if (data.job_role) {
          setError(
            Array.isArray(data.job_role) ? data.job_role[0] : data.job_role,
          );
        } else if (data.organization) {
          setError(
            Array.isArray(data.organization)
              ? data.organization[0]
              : data.organization,
          );
        } else if (data.error) {
          setError(data.error);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Failed to complete profile. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setShowAccountCreated(true);
      localStorage.setItem("onboardingShowAccountCreated", "true");
    } catch (err) {
      console.error("Profile completion error:", err);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <OnboardingLayout>
          <div className="w-full min-h-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
          {/* Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-lg relative">
            {/* Header section with back button and step pointer */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all -ml-2"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
              <div className="text-white/70 text-xs sm:text-sm font-inter">
                2 of 2
              </div>
            </div>

              <h2 className="text-white text-xl sm:text-2xl font-semibold font-cormorant mb-2 sm:mb-3 text-left">
                Complete your profile
              </h2>

              <p className="text-white/80 text-xs sm:text-sm font-inter mb-4 sm:mb-6 leading-relaxed text-left">
                Let us know a little about yourself.
              </p>

              <div className="space-y-4 sm:space-y-5">
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
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      First name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={handleLettersOnly(
                        setFirstName,
                        setFirstNameError,
                      )}
                      placeholder="First name"
                      className="w-full px-3 sm:px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                      required
                      disabled={isLoading}
                    />
                    {firstNameError && (
                      <p className="text-red-300 text-xs mt-1 font-inter">
                        {firstNameError}
                      </p>
                    )}
                  </div>
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      Last name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={handleLettersOnly(
                        setLastName,
                        setLastNameError,
                      )}
                      placeholder="Last name"
                      className="w-full px-3 sm:px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                      required
                      disabled={isLoading}
                    />
                    {lastNameError && (
                      <p className="text-red-300 text-xs mt-1 font-inter">
                        {lastNameError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Age and Experience */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      Age <span className="text-red-400">*</span>
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
                      disabled={isLoading}
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                      Years Experience <span className="text-red-400">*</span>
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
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="text-left">
                  <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                    Current Organization <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Enter your organization"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Job Role */}
                <div className="text-left">
                  <label className="block text-white/80 text-xs sm:text-sm font-inter mb-2">
                    Current Job Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={handleLettersOnly(setJobRole, setJobRoleError)}
                    placeholder="Enter job role"
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition text-sm min-h-[48px]"
                    required
                    disabled={isLoading}
                  />
                  {jobRoleError && (
                    <p className="text-red-300 text-xs mt-1 font-inter">
                      {jobRoleError}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#F26767] text-white text-xs sm:text-sm font-inter text-left flex items-center gap-2 sm:gap-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isLoading ||
                    !firstName.trim() ||
                    !lastName.trim() ||
                    !age.trim() ||
                    !experience.trim() ||
                    !organization.trim() ||
                    !jobRole.trim()
                  }
                  className="w-full py-3 bg-white text-[#7C3AED] font-medium rounded-full hover:bg-white/95 active:scale-95 transition-all font-inter text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {isLoading && (
                    <span className="inline-block w-4 h-4 border-2 border-[#7C3AED]/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>
                    {isLoading ? "Completing Profile..." : "Complete Profile"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </OnboardingLayout>
      </div>

      <AccountCreatedModal
        isOpen={showAccountCreated}
        onClose={() => {
          setShowAccountCreated(false);
          localStorage.removeItem("onboardingShowAccountCreated");
          localStorage.removeItem("onboardingShowCompleteProfile");
          localStorage.removeItem("onboardingShowCreateAccount");
          localStorage.removeItem("onboardingStep");
          localStorage.removeItem("onboardingAuthTokens");
          localStorage.setItem("onboardingComplete", "true");
          onClose();
        }}
      />
    </>
  );
};

export default CompleteProfileModal;
