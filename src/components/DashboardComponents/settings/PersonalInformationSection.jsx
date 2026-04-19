import React from "react";
import ProfileImageUpload from "./ProfileImageUpload";
export default function PersonalInformationSection({
  personalInfo,
  profileImage,
  onPersonalInfoChange,
  onImageUpload,
  onImageDelete,
  onSaveChanges,
}) {
  return (
    <div className="mb-6 shadow-sm p-4 lg:p-6 bg-[#fafafa] border-[#f2f2f2] border lg:rounded-3xl rounded-2xl">
      <div className="mb-10">
        <h2 className="text-xl lg:text-2xl font-cormorant font-bold text-[#3D3D3D] mb-1">
          Personal information
        </h2>
        <p className="text-sm sm:text-base text-[#3D3D3D]/60 font-inter font-medium">
          Add and update your personal information.
        </p>
      </div>
      <ProfileImageUpload
        profileImage={profileImage}
        onImageUpload={onImageUpload}
        onImageDelete={onImageDelete}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-6 gap-4 lg:mb-8 mb-5">
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            First name
          </label>
          <input
            type="text"
            name="firstName"
            value={personalInfo.firstName}
            onChange={onPersonalInfoChange}
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Last name
          </label>
          <input
            type="text"
            name="lastName"
            value={personalInfo.lastName}
            onChange={onPersonalInfoChange}
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Age
          </label>
          <input
            type="text"
            name="age"
            value={personalInfo.age}
            onChange={onPersonalInfoChange}
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={onPersonalInfoChange}
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Current job role
          </label>
          <input
            type="text"
            name="currentJobRole"
            value={personalInfo.currentJobRole}
            onChange={onPersonalInfoChange}
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />

        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Years of experience
          </label>
          <input
            type="number"
            name="yearsOfExperience"
            value={personalInfo.yearsOfExperience}
            onChange={onPersonalInfoChange}
            placeholder="Years"
            min="0"
            max="50"
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />

        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Current organization
          </label>
          <input
            type="text"
            name="organization"
            value={personalInfo.organization}
            onChange={onPersonalInfoChange}
            placeholder="Enter your organization"
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 bg-[#f7f7f7] lg:text-md text-sm border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
      </div>
      <button
        onClick={onSaveChanges}
        className="lg:px-6 px-4 lg:py-3 py-2 bg-[#3D3D3D] hover:bg-[#2D2D2D] text-white lg:rounded-2xl rounded-md transition-colors font-medium text-sm sm:text-base"
        type="button"
      >
        Save changes
      </button>
    </div>
  );
}
