import React, { useState, useEffect } from "react";
import SettingsSidebar from "./SettingsSidebar";
import SettingsHeader from "./SettingsHeader";
import PersonalInformationSection from "./PersonalInformationSection";
import ChangePasswordSection from "./ChangePasswordSection";
// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://16.16.141.229:8000";
const API_AUTH_URL = `${API_BASE_URL}/api/auth`;

export default function SettingsScreen() {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    currentJobRole: "",
    yearsOfExperience: "",
    organization: "",
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSavedModal, setShowSavedModal] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_AUTH_URL}/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPersonalInfo({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            age: data.age || "",
            email: data.email || "",
            currentJobRole: data.job_role || "",
            yearsOfExperience: data.years_of_experience || "",
            organization: data.organization || "",
          });

          if (data.profile_image) {
            // Check if it's a relative path and prepend API URL if needed
            let imageUrl = data.profile_image;
            if (
              imageUrl &&
              !imageUrl.startsWith("http") &&
              !imageUrl.startsWith("data:")
            ) {
              // Remove explicit /api path if it exists in base url to get just the domain for media
              // OR simple convention: if it starts with /, prepend base url
              imageUrl = `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
            }
            setProfileImage(imageUrl);
          }
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file); // Store the file object for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageDelete = () => {
    setProfileImage(null);
    setSelectedImageFile(null);
  };
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Basic validation
      if (
        !personalInfo.firstName ||
        !personalInfo.lastName ||
        !personalInfo.age ||
        !personalInfo.currentJobRole
      ) {
        alert("Please fill in all required fields (Name, Age, Job Role)");
        return;
      }

      const formData = new FormData();
      formData.append("first_name", personalInfo.firstName);
      formData.append("last_name", personalInfo.lastName);
      formData.append("age", parseInt(personalInfo.age) || 0);
      formData.append(
        "years_of_experience",
        parseInt(personalInfo.yearsOfExperience) || 0,
      );
      formData.append("job_role", personalInfo.currentJobRole);
      formData.append("organization", personalInfo.organization);

      if (selectedImageFile) {
        formData.append("profile_image", selectedImageFile);
      }

      const response = await fetch(`${API_AUTH_URL}/complete-profile/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type must NOT be set when using FormData, browser sets it with boundary
        },
        body: formData,
      });

      if (response.ok) {
        setShowSavedModal(true);
      } else {
        const data = await response.json();
        // Construct a more detailed error message
        let errorMessage = "Failed to save changes";
        if (data.detail) errorMessage = data.detail;
        else if (data.message) errorMessage = data.message;
        else {
          // Check for field-specific errors
          const fieldErrors = Object.keys(data).map((key) => {
            const err = Array.isArray(data[key]) ? data[key][0] : data[key];
            return `${key}: ${err}`;
          });
          if (fieldErrors.length > 0) errorMessage = fieldErrors.join("\n");
        }
        alert(errorMessage);
        console.error("Save error details:", data);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving: " + error.message);
    }
  };
  const handleChangePassword = () => {
    console.log("Changing password:", passwordInfo);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="py-8">
      <SettingsHeader />
      <main className="grid lg:grid-cols-12 bg-white lg:gap-7 gap-4 rounded-3xl shadow-md lg:p-8 p-5 items-stretch">
        <div className="lg:col-span-3 flex">
          <SettingsSidebar />
        </div>
        <div className="lg:col-span-9 ">
          <PersonalInformationSection
            personalInfo={personalInfo}
            profileImage={profileImage}
            onPersonalInfoChange={handlePersonalInfoChange}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            onSaveChanges={handleSaveChanges}
          />
          <ChangePasswordSection
            passwordInfo={passwordInfo}
            onPasswordChange={handlePasswordChange}
            onChangePassword={handleChangePassword}
          />
        </div>
      </main>

      {/* Saved Success Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSavedModal(false)} />
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full mx-auto p-6 sm:p-8 md:p-10 text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img
                src="/assets/images/onboarding/Swal_Icon.webp"
                alt="Success"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 font-cormorant px-2">
              Changes Saved Successfully
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 font-inter leading-relaxed px-2">
              Your profile has been updated successfully.
            </p>
            <button
              onClick={() => setShowSavedModal(false)}
              className="w-full sm:w-auto bg-[#374151] text-white px-8 py-3 rounded-full font-medium hover:bg-[#4B5563] active:scale-95 transition-all font-inter text-sm sm:text-base min-h-[48px]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
