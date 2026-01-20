import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationPopup from "../DashboardComponents/notification/Notification";
import { assessmentService } from "../../services/assessment";

const DiagnosticComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // runId passed from DiagnosticSteps
  const runId = location.state?.runId;

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!runId) {
        // If no runId, maybe just show the page as is (demo mode) or error
        // console.warn("No runId provided");
        setLoading(false);
        return;
      }

      try {
        // First trigger brief generation (background task usually, but we call it)
        await assessmentService.generateBrief(runId).catch(err => console.error("Brief generation failed", err));

        // Then fetch results
        const data = await assessmentService.getResults(runId);
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch results", err);
        console.error("Failed to fetch results", err);
        setError(err.message || "Could not load results. Please try refreshing.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [runId]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="bg-[#ababab] 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 py-1.5 px-4 sticky top-0 z-50">
        <div className="relative z-20 flex items-center justify-between h-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            type="button"
            aria-label="Go to Dashboard"
          >
            <img
              src="/assets/images/dashboard/logowhite.webp"
              alt="firmly logo"
              className="h-7 w-auto"
            />
          </button>
          <div className="flex items-center sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-white">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/images/dashboard/starwhite.webp"
                  alt="user icon"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
                <span className="text-white/70 text-sm sm:text-base">
                  Amalia
                </span>
                <span className="text-sm flex items-center justify-center bg-[#ababab] border border-white/20 text-white/70 px-2 py-0.5 rounded-full">
                  • online
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                className="relative text-white p-2 rounded-lg transition-colors"
                onClick={() => setIsNotificationOpen((s) => !s)}
                aria-expanded={isNotificationOpen}
                aria-label="Toggle notifications"
                type="button"
              >
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-2 h-2.5 w-2.5 bg-[#D46FA8] rounded-full" />
              </button>
            </div>
          </div>
        </div>
        <NotificationPopup
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </header>

      <div className="flex-1 border-[8px] sm:border-[12px] md:border-[16px] border-[#f5f5f5] relative overflow-hidden bg-[#ebebeb] rounded-2xl sm:rounded-3xl m-2 sm:m-4 flex flex-col">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/images/onboarding/Diagnostic_bg.webp"
            alt="onboarding background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        {/* Decorative corners - hidden on mobile to save space/reduce clutter */}
        <div className="absolute top-0 left-0 pointer-events-none hidden md:block">
          <img src="/assets/images/onboarding/topleft-diag.webp" alt="" className="w-32 h-32 lg:w-48 lg:h-48 opacity-80" />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none hidden md:block">
          <img src="/assets/images/onboarding/Diagnostic_Topright.webp" alt="" className="w-32 h-32 lg:w-48 lg:h-48 opacity-80" />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none hidden md:block">
          <img src="/assets/images/onboarding/Diagnostic_Bottomright.webp" alt="" className="w-32 h-40 lg:w-48 lg:h-60 opacity-80" />
        </div>

        {/* Scrollable Content Container */}
        <div className="w-full h-full relative z-10 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 max-w-[1400px] mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

              {/* Left Column: Text & Results */}
              <div className="lg:col-span-7 flex flex-col order-2 lg:order-1">

                {/* Circle Badge - Mobile: Inline/Top, Desktop: Negative margin pull-up */}
                <div className="mb-6 lg:-mt-20 lg:mb-8 self-start">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white bg-[#ebebeb] flex items-center justify-center shadow-xl">
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 font-inter">
                      100%
                    </span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 font-cormorant leading-tight">
                  Firmly Diagnostic
                </h1>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 font-inter max-w-2xl">
                  Excellent work! Your diagnostic assessment is now complete.
                  We will now share your self-reported scores across key metrics that influence workplace wellbeing and leadership development.
                </p>

                {/* Results Grid */}
                <div className="bg-white/40 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-sm border border-white/50">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 font-cormorant flex items-center">
                    <span className="w-1.5 h-6 bg-purple-500 mr-3 rounded-full"></span>
                    Your Performance Profile
                  </h3>

                  {loading ? (
                    <div className="py-8 text-center text-gray-500 animate-pulse font-inter">Processing your results...</div>
                  ) : error ? (
                    <div className="py-8 text-center text-red-500 font-inter bg-red-50/50 rounded-lg border border-red-100 px-4">
                      {error}
                      <button
                        onClick={() => window.location.reload()}
                        className="block mx-auto mt-4 text-sm text-gray-700 underline"
                      >
                        Try Refreshing
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results && results.details && Array.isArray(results.details) ? (
                        results.details.map((item, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                              {item.domain ? item.domain.replace(/_/g, ' ') : "Metric"}
                            </div>
                            <div className="flex items-baseline space-x-2">
                              <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                                {typeof item.percent_0_100 === 'number'
                                  ? `${Math.round(item.percent_0_100)}%`
                                  : (typeof item.raw_mean_1_7 === 'number' ? item.raw_mean_1_7.toFixed(1) : '—')}
                              </span>
                              {/* Optional visual indicator bar could go here */}
                            </div>
                          </div>
                        ))
                      ) : results && results.scores ? (
                        Object.entries(results.scores).map(([key, value]) => (
                          <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{key.replace(/_/g, ' ')}</div>
                            <div className="text-xl font-bold text-gray-800">{typeof value === 'number' ? value.toFixed(1) : value}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 col-span-full">No detailed results available.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: CTA Card */}
              <div className="lg:col-span-5 w-full lg:max-w-md ml-auto order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transform lg:translate-y-12">
                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-purple-50 rounded-full blur-2xl"></div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-cormorant relative z-10">
                    You're off to a great start!
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-8 font-inter leading-relaxed relative z-10">
                    These scores are a benchmark for your growth and a celebration of your capabilities. Your coach Amalia will help you build on this foundation.
                  </p>

                  <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#222] text-white rounded-full text-sm font-semibold hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticComplete;
