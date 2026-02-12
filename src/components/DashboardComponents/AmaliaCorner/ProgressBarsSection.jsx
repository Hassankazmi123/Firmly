import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { assessmentService } from "../../../services/assessment";

const ProgressBarsSection = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Domain mapping configuration
  const domainConfig = {
    GOAL: { label: "Goal Orientation", color: "green" },
    BELONG: { label: "Workplace Belonging", color: "blue" },
    ENG: { label: "Engagement", color: "purple" },
    RES: { label: "Resilience", color: "pink" },
    SELF: { label: "Self-Belief", color: "orange" },
    EMP: { label: "Empathy", color: "lightBlue" },
  };

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        // Get assessment ID from localStorage or use default
        const assessmentId = localStorage.getItem("assessmentId") || "93";
        const data = await assessmentService.getResults(assessmentId);

        if (data && data.domains) {
          const formattedData = data.domains.map((domain) => {
            const config = domainConfig[domain.domain] || {
              label: domain.domain,
              color: "green",
            };
            
            return {
              label: config.label,
              score: Math.round(parseFloat(domain.percent_0_100)),
              peersScore: Math.round(parseFloat(domain.peer_mean_0_100)),
              color: config.color,
              vectorPosition: Math.round(parseFloat(domain.peer_mean_0_100)),
            };
          });

          setProgressData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch assessment results:", error);
        // Fallback to default data on error
        setProgressData([
          {
            label: "Goal Orientation",
            score: 89,
            peersScore: 67,
            color: "green",
            vectorPosition: 69,
          },
          {
            label: "Workplace Belonging",
            score: 82,
            peersScore: 67,
            color: "blue",
            vectorPosition: 71,
          },
          {
            label: "Engagement",
            score: 48,
            peersScore: 67,
            color: "purple",
            vectorPosition: 73,
          },
          {
            label: "Resilience",
            score: 79,
            peersScore: 67,
            color: "pink",
            vectorPosition: 70,
          },
          {
            label: "Self-Belief",
            score: 52,
            peersScore: 67,
            color: "orange",
            vectorPosition: 72,
          },
          {
            label: "Empathy",
            score: 44,
            peersScore: 67,
            color: "lightBlue",
            vectorPosition: 74,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 md:mb-8">
        <div className="text-center py-4 text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mb-6 md:mb-8">
      {progressData.map((item, index) => (
        <ProgressBar
          key={index}
          label={item.label}
          yourScore={item.score}
          peersScore={item.peersScore}
          color={item.color}
          initialVectorPosition={item.vectorPosition}
        />
      ))}
    </div>
  );
};
export default ProgressBarsSection;