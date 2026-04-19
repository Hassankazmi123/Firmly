import React from "react";
export default function ChangePasswordSection({
  passwordInfo,
  onPasswordChange,
  onChangePassword,
}) {
  return (
    <div className="shadow-sm p-4 lg:p-6 bg-[#fafafa] border-[#f2f2f2] border lg:rounded-3xl rounded-2xl">
      <div className="lg:mb-10 mb-5">
        <h2 className="text-xl lg:text-2xl font-cormorant font-bold text-[#3D3D3D] mb-1">
          Change password
        </h2>
        <p className="text-sm sm:text-base text-[#3D3D3D]/60 font-inter font-medium">
          Your new password must be at least 8 characters long.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-6 gap-4 lg:mb-8 mb-5">
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm ">
            Current password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={passwordInfo.currentPassword}
            onChange={onPasswordChange}
            placeholder="Insert current password"
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 lg:text-md text-sm bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            New password
          </label>
          <input
            type="password"
            name="newPassword"
            value={passwordInfo.newPassword}
            onChange={onPasswordChange}
            placeholder="Insert new password"
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 lg:text-md text-sm bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block  font-medium font-inter text-[#3D3D3D]/60 lg:mb-2 mb-1 lg:text-md text-sm">
            Confirm password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordInfo.confirmPassword}
            onChange={onPasswordChange}
            placeholder="Confirm new password"
            className="w-full lg:px-4 px-2 lg:py-3 py-1.5 lg:text-md text-sm  bg-[#f7f7f7] border border-[#e8e8e8] rounded-lg lg:rounded-2xl text-gray-900 focus:outline-none focus:ring-[1px] focus:ring-[#6664D3] focus:border-transparent"
          />
        </div>
      </div>
      <button
        onClick={onChangePassword}
        className="lg:px-6 px-4 lg:py-3 py-2 bg-[#3D3D3D] hover:bg-[#2D2D2D] text-white lg:rounded-2xl rounded-md transition-colors font-medium text-sm sm:text-base"
        type="button"
      >
        Change password
      </button>
    </div>
  );
}
