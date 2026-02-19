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
  const [currentScreen, setCurrentScreen] = useState(() => {
    const isInitialized = localStorage.getItem("appInitialized") === "true";
    if (isInitialized) {
      const saved = localStorage.getItem("onboardingStep");
      return saved ? Number(saved) : 0;
    }
    return 0;
  });

  useEffect(() => {
    const isFirstLoad = !localStorage.getItem("appInitialized");
    const hasLoggedOut = localStorage.getItem("hasLoggedOut") === "true";

    if (isFirstLoad || hasLoggedOut) {
      clearAppCache().catch((e) => console.warn("clearAppCache error:", e));

      localStorage.clear();
      
      localStorage.setItem("appInitialized", "true");
      
      localStorage.setItem("onboardingStep", "0");

      console.log("Cache cleared and reset to Onboarding Screen 1 (first load or logout)");
    }
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
