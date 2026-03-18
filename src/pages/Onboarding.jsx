import React, { useState, useEffect } from "react";
import OnboardingLayout from "../components/OnboardingComponents/OnboardingLayout";
import IntroCard from "../components/OnboardingComponents/IntroCard";
import PathwayCard from "../components/OnboardingComponents/PathwayCard";
import Screen3Card from "../components/OnboardingComponents/Screen3Card";
import Screen4Card from "../components/OnboardingComponents/Screen4Card";
import clearAppCache from "../utils/cache";

const Onboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedStep = localStorage.getItem("onboardingStep");

    const perfEntries = performance.getEntriesByType("navigation");
    const isReload =
      (perfEntries.length > 0 && perfEntries[0].type === 'reload') ||
      (window.performance && window.performance.navigation && window.performance.navigation.type === 1) ||
      (sessionStorage.getItem("onboarding_session_active") === "true");

    if (isReload && savedStep !== null) {
      return Number(savedStep);
    }

    return 0;
  });

  useEffect(() => {
    localStorage.setItem("onboardingStep", currentScreen);
    sessionStorage.setItem("onboarding_session_active", "true");
  }, [currentScreen]);

  useEffect(() => {
    const perfEntries = performance.getEntriesByType("navigation");
    const isReload =
      (perfEntries.length > 0 && perfEntries[0].type === 'reload') ||
      (window.performance && window.performance.navigation && window.performance.navigation.type === 1) ||
      (sessionStorage.getItem("onboarding_session_active") === "true");

    if (!isReload) {
      clearAppCache().catch((e) => console.warn("clearAppCache error:", e));

      sessionStorage.setItem("onboarding_session_active", "true");
    }
  }, []);

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
    <OnboardingLayout onLogoClick={() => handleSetScreen(2)}>
      {screens[currentScreen]?.component}
    </OnboardingLayout>
  );
};

export default Onboarding;
