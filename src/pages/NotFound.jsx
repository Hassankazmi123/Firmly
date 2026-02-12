import { Link } from "react-router-dom";
import OnboardingLayout from "../components/OnboardingComponents/OnboardingLayout";

function NotFound() {
  return (
    <OnboardingLayout>
      <div className="w-full h-full flex items-center justify-center px-4 sm:px-6">
        <div className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center drop-shadow-lg max-w-2xl w-full overflow-hidden">
          <img
            src="/assets/images/onboarding/Child_Div_Topright.webp"
            alt="decoration top right"
            className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 pointer-events-none z-20"
          />
          <img
            src="/assets/images/onboarding/Child_Div_Bottomleft.webp"
            alt="decoration bottom left"
            className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 pointer-events-none z-20"
          />

          <div className="relative z-30 flex flex-col items-center gap-4 sm:gap-5">
            <p className="text-white/80 text-sm sm:text-base font-inter">Error 404</p>
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold font-cormorant leading-tight">
              Page not found
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-inter leading-relaxed max-w-lg">
              The route does not exist, or this private page is not accessible
              right now.
            </p>

            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/onboarding"
                className="px-8 py-2.5 bg-white text-[#6b4bff] font-medium rounded-2xl shadow-sm hover:bg-white/90 active:scale-95 transition-all font-inter text-sm sm:text-base min-h-[44px] flex items-center justify-center w-full sm:w-auto"
              >
                Go to onboarding
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-2.5 border border-white/40 text-white font-medium rounded-2xl hover:bg-white/10 active:scale-95 transition-all font-inter text-sm sm:text-base min-h-[44px] flex items-center justify-center w-full sm:w-auto"
              >
                Try dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}

export default NotFound;
