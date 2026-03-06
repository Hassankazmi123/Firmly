import React, { useState, useRef, useEffect } from "react";

const NotificationPopup = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState("All");
  const [imageError, setImageError] = useState(false);
  const popupRef = useRef(null);
  const notifications = [
    {
      id: 1,
      title: "Diagnostics",
      message:
        "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program.",
      time: "1hr ago",
      hasActions: false,
    },
    {
      id: 2,
      title: "Leadership pathway",
      message:
        "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program.",
      time: "1hr ago",
      hasActions: false,
    },
    {
      id: 3,
      title: "Amailia",
      message:
        "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program.",
      time: "1hr ago",
      hasActions: true,
    },
    {
      id: 4,
      title: "Amailia",
      message:
        "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program.",
      time: "1hr ago",
      hasActions: false,
    },
    {
      id: 5,
      title: "Amailia",
      message:
        "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program.",
      time: "1hr ago",
      hasActions: false,
    },
    {
      id: 6,
      title: "Amailia",
      message:
        "Welcome to our final session! Before we dive in, I want to thank you for your engagement throughout this program.",
      time: "1hr ago",
      hasActions: false,
    },
  ];
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
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[99998] bg-transparent" onClick={onClose} aria-hidden="true" />
      <div className="fixed z-[99999] top-20 right-0 sm:right-8 md:right-12 lg:right-16">
        <div
          className="shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden rounded-lg bg-white"
          ref={popupRef}
        >
          <div className="px-4 py-4 bg-[#ededed] flex items-center justify-between relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{
                backgroundImage: "url(/assets/images/dashboard/notibg.webp)",
                filter: "brightness(0.9) contrast(1.1) saturate(0.8)",
              }}
            ></div>
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center justify-between">
                <h2 className="lg:text-2xl text-xl font-cormorant text-[#3D3D3D]">
                  Notifications
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFilter("All")}
                  className={`px-5 py-2 rounded-lg text-sm font-inter transition-colors ${
                    filter === "All"
                      ? "bg-white text-[#6664D3]"
                      : "bg-white/40 text-[#6664D3]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("Unread")}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "Unread"
                      ? "bg-white text-[#6664D3]"
                      : "bg-white/40 text-[#6664D3]"
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          </div>
          <div className="lg:max-h-[380px] md:max-h-[450px] 2xl:max-h-[600px] xl:max-h-[500px] max-h-[400px]  overflow-y-auto bg-white">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8  flex items-center justify-center overflow-hidden">
                        {!imageError ? (
                          <img
                            src="/assets/images/dashboard/noti.webp"
                            alt="notification icon"
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                              fill="white"
                              opacity="0.9"
                            />
                            <path
                              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                              fill="white"
                              opacity="0.7"
                            />
                            <circle cx="12" cy="12" r="1.5" fill="white" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-[#3D3D3D] font-cormorant">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-[#3D3D3D]  font-inter font-medium ">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-[#3D3D3D]/50 font-inter-medium leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.hasActions && (
                        <div className="flex items-center space-x-2 mt-3">
                          <button className="px-4 py-2 bg-[#3D3D3D] text-[#F5F5F5] rounded-xl text-sm font-inter-medium hover:bg-gray-700 transition-colors">
                            Accept
                          </button>
                          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                            ignore
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <div className="border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default NotificationPopup;
