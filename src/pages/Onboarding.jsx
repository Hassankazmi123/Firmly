// import React, { useState, useEffect } from "react";
// import OnboardingLayout from "../components/OnboardingComponents/OnboardingLayout";
// import IntroCard from "../components/OnboardingComponents/IntroCard";
// import PathwayCard from "../components/OnboardingComponents/PathwayCard";
// import Screen3Card from "../components/OnboardingComponents/Screen3Card";
// import Screen4Card from "../components/OnboardingComponents/Screen4Card";
// import clearAppCache from "../utils/cache";

// const Onboarding = () => {
//   const [currentScreen, setCurrentScreen] = useState(0);

//   useEffect(() => {
//     clearAppCache().catch((e) => console.warn("clearAppCache error:", e));
//   }, []);

//   const handleSetScreen = (screenIndex) => {
//     setCurrentScreen(screenIndex);
//   };

//   const screens = [
//     {
//       component: <IntroCard onNext={() => handleSetScreen(1)} />,
//     },
//     {
//       component: (
//         <PathwayCard
//           onPrevious={() => handleSetScreen(0)}
//           onNext={() => handleSetScreen(2)}
//         />
//       ),
//     },
//     {
//       component: (
//         <Screen3Card
//           onPrevious={() => handleSetScreen(1)}
//           onNext={() => handleSetScreen(3)}
//           onLogin={() => handleSetScreen(3)}
//         />
//       ),
//     },
//     {
//       component: <Screen4Card onBack={() => handleSetScreen(2)} />,
//     },
//   ];

//   return (
//     <OnboardingLayout>{screens[currentScreen]?.component}</OnboardingLayout>
//   );
// };

// export default Onboarding;

import React, { useState, useEffect } from "react";
import OnboardingLayout from "../components/OnboardingComponents/OnboardingLayout";
import IntroCard from "../components/OnboardingComponents/IntroCard";
import PathwayCard from "../components/OnboardingComponents/PathwayCard";
import Screen3Card from "../components/OnboardingComponents/Screen3Card";
import Screen4Card from "../components/OnboardingComponents/Screen4Card";
import clearAppCache from "../utils/cache";

const Onboarding = () => {
  // Check if we're refreshing while ON onboarding page, or navigating TO onboarding page
  const [currentScreen, setCurrentScreen] = useState(() => {
    const appInitialized = localStorage.getItem("appInitialized");
    const isInOnboardingFlow = sessionStorage.getItem("isInOnboardingFlow") === "true";
    
    // If first load - start at screen 0
    if (!appInitialized) {
      return 0;
    }
    
    // If we're refreshing while ON onboarding page, restore the screen
    if (isInOnboardingFlow) {
      const saved = localStorage.getItem("onboardingStep");
      return saved ? Number(saved) : 0;
    }
    
    // If navigating FROM another page TO onboarding, always show Screen 1
    return 0;
  });

  useEffect(() => {
    const appInitialized = localStorage.getItem("appInitialized");
    const hasLoggedOut = localStorage.getItem("hasLoggedOut") === "true";

    // Only clear on FIRST load (no appInitialized yet) or after logout
    if (!appInitialized || hasLoggedOut) {
      // Clear everything
      localStorage.clear();
      sessionStorage.clear();
      
      // Set flags for next load
      localStorage.setItem("appInitialized", "true");
      localStorage.setItem("onboardingStep", "0");
      localStorage.removeItem("hasLoggedOut");

      // Clear cache
      clearAppCache().catch((e) => console.warn("clearAppCache error:", e));

      console.log("First load: Cache cleared, reset to Screen 1");
    }
    
    // Mark that we're IN the onboarding flow (for refresh detection)
    sessionStorage.setItem("isInOnboardingFlow", "true");
    
    // Clean up when leaving onboarding
    return () => {
      sessionStorage.removeItem("isInOnboardingFlow");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("onboardingStep", currentScreen);
  }, [currentScreen]);

  const handleSetScreen = (screenIndex) => {
    setCurrentScreen(screenIndex);
  };

  const screens = [
    {
      component: <IntroCard onNext={() => handleSetScreen(1)} />,
    },
    {
      component: (
        <PathwayCard
          onPrevious={() => handleSetScreen(0)}
          onNext={() => handleSetScreen(2)}
        />
      ),
    },
    {
      component: (
        <Screen3Card
          onPrevious={() => handleSetScreen(1)}
          onNext={() => handleSetScreen(3)}
          onLogin={() => {
            handleSetScreen(3);
          }}
        />
      ),
    },
    {
      component: <Screen4Card onBack={() => handleSetScreen(2)} />,
    },
  ];

  return (
    <OnboardingLayout>{screens[currentScreen]?.component}</OnboardingLayout>
  );
};

export default Onboarding;
