import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavigationTracker = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const historyStr = sessionStorage.getItem("navigationHistory");
    let history = historyStr ? JSON.parse(historyStr) : [];
    const currentPath = location.pathname;
    if (history.length === 0 || history[history.length - 1] !== currentPath) {
      history.push(currentPath);
      sessionStorage.setItem("navigationHistory", JSON.stringify(history));
      console.log("Navigation tracked:", currentPath, "History:", history);
    }
  }, [location.pathname]);

  return children;
};

export default NavigationTracker;
