import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
export default function SettingsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection =
    location.pathname === "/dashboard/account-settings"
      ? "account-settings"
      : "data-privacy";
  return (
    <aside className="bg-[#fafafa] border-[#f2f2f2] border flex-shrink-0 w-full h-full lg:rounded-3xl rounded-2xl">
      <nav className="p-4 lg:p-6 space-y-4 lg:space-y-6 h-full">
        <div className="border-b border-[#3D3D3D]/10 pb-6">
          <h3 className="text-xs font-inter font-semibold text-[#3D3D3D]/40  mb-3 px-2">
            Personal
          </h3>
          <button
            onClick={() => {
              navigate("/dashboard/account-settings");
            }}
            className={`w-full text-left px-4 py-2 rounded-xl transition-colors shadow-xs ${
              activeSection === "account-settings"
                ? "bg-[#f7f7f7] text-[#3D3D3D] font-inter-medium"
                : ""
            }`}
          >
            Account settings
          </button>
        </div>
      </nav>
    </aside>
  );
}