import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SummaryCard from "../AmaliaCorner/SummaryCard";
import { assessmentService } from "../../../services/assessment";

const GrowAndGlowSection = ({
  hasVisitedAmaliaCorner = false,
  isPathwayGenerated = false,
}) => {
  const navigate = useNavigate();
  const [doingGreatItems, setDoingGreatItems] = useState([]);
  const [growthAreasItems, setGrowthAreasItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        let assessmentId = localStorage.getItem("assessmentId");

        // Auto-recover assessment ID if missing
        if (!assessmentId) {
          console.log("No assessmentId in cache for GrowAndGlow, attempting recovery...");
          const resumeData = await assessmentService.startAssessment();
          assessmentId = resumeData?.id || resumeData?.run_id || resumeData?.assessment_id || resumeData?.assessmentId ||
            resumeData?.assessment?.id || resumeData?.run?.id || resumeData?.data?.id ||
            localStorage.getItem("assessmentId"); // Fallback to cache since service saves it there
        }

        if (!assessmentId) {
          throw new Error("Could not find or recover assessmentId");
        }

        const data = await assessmentService.getResults(assessmentId);

        if (data && data.domains && data.glow && data.grow) {
          const domainLabels = {
            GOAL: "Goal Orientation",
            BELONG: "Workplace Belonging",
            ENG: "Engagement",
            RES: "Resilience",
            SELF: "Self-belief",
            EMP: "Empathy",
          };

          const domainAbbreviations = {
            GOAL: "GOA",
            BELONG: "WOR",
            ENG: "ENG",
            RES: "RES",
            SELF: "SEL",
            EMP: "EMP",
          };

          // Map glow items (Doing Great)
          const glowData = data.glow.map((domainCode) => {
            const domainData = data.domains.find(
              (d) => d.domain === domainCode,
            );
            return {
              abbreviation: domainAbbreviations[domainCode] || domainCode,
              label: domainLabels[domainCode] || domainCode,
              score: domainData
                ? Math.round(parseFloat(domainData.percent_0_100))
                : 0,
            };
          });

          // Map grow items (Growth Areas)
          const growData = data.grow.map((domainCode) => {
            const domainData = data.domains.find(
              (d) => d.domain === domainCode,
            );
            return {
              abbreviation: domainAbbreviations[domainCode] || domainCode,
              label: domainLabels[domainCode] || domainCode,
              score: domainData
                ? Math.round(parseFloat(domainData.percent_0_100))
                : 0,
            };
          });

          setDoingGreatItems(glowData);
          setGrowthAreasItems(growData);

          // If we successfully recovered data, ensure the "visited" flags are restored
          if (!hasVisitedAmaliaCorner) {
            console.log("Restoring visited flags based on recovered data...");
            sessionStorage.setItem("hasVisitedAmaliaCorner", "true");
            // We can't update the parent's prop directly easily without a callback, 
            // but the parent will re-read session state on next render or we can just 
            // use a local state for the UI if needed.
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch assessment data for GrowAndGlow:",
          error,
        );
        // Force user to diagnostic if data is missing or failed
        navigate("/diagnostic");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [hasVisitedAmaliaCorner, isPathwayGenerated]);

  const handleImproveClick = () => {
    const isStarted = localStorage.getItem("hasStartedSessions") === "true";
    if (!isStarted) {
      sessionStorage.setItem("selectedConversation", "diagnostic");
    } else {
      // Clear any specific saved conversation to let AmaliaCorner pick the latest unlocked session
      sessionStorage.removeItem("selectedConversation");
    }
    navigate("/amalia-corner");
  };

  const showRealContent = isPathwayGenerated;

  return (
    <section data-tour="grow-glow" className="py-8 lg:py-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 font-cormorant">
            Grow & Glow
          </h2>
          <p className="text-base text-[#3D3D3D]/60 font-inter">
            Get insights on where you shine and what needs to be improved
          </p>
        </div>
        {showRealContent && (
          <button
            onClick={handleImproveClick}
            className="px-5 py-3 bg-[#3D3D3D] text-white rounded-xl font-medium transition-colors text-sm md:text-base hover:bg-[#2D2D2D] whitespace-nowrap"
          >
            Improve Growth Areas
          </button>
        )}
      </div>
      {showRealContent ? (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-[#0000000A] bg-gray-100 rounded-2xl p-6 min-h-[250px] flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
            <div className="border border-[#0000000A] bg-gray-100 rounded-2xl p-6 min-h-[250px] flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <SummaryCard
              title="Doing great"
              subtitle="Your female talent is thriving in the following domains."
              items={doingGreatItems}
              bgColor="bg-[#378C78]"
              iconImage="/assets/images/dashboard/doing.webp"
            />
            <SummaryCard
              title="Growth areas"
              subtitle="These areas need your immediate attention to balance workplace wellbeing."
              items={growthAreasItems}
              bgColor="bg-[#C56A55]"
              iconImage="/assets/images/dashboard/growth.webp"
            />
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div
            data-tour="doing-great"
            className="relative border border-[#0000000A] bg-gray-100 rounded-2xl p-6 overflow-hidden lg:min-h-[250px] min-h-[150px] flex items-center justify-center"
          >
            <img
              src="/assets/images/dashboard/DoingGreattop.webp"
              alt="dashboard top background"
              className="absolute top-0 right-0 lg:w-[216px] w-[100px] h-[100px]  z-50 lg:h-[201px] object-cover object-top"
            />
            <div className="relative z-10 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl lg:text-3xl font-bold text-[#3D3D3D] mb-1 font-cormorant">
                Doing Great
              </h3>
              <p className="lg:text-base text-xs text-[#3D3D3D]/60 font-inter">
                These are the domains you're thriving in
              </p>
            </div>
            <img
              src="/assets/images/dashboard/DoingGreatbottom.webp"
              alt="dashboard top background"
              className="absolute bottom-0 left-0 lg:w-[216px] w-[100px] h-[100px]  z-50 lg:h-[201px] object-cover object-top"
            />
          </div>
          <div className="relative border border-[#0000000A] bg-gray-100 rounded-2xl p-6 overflow-hidden lg:min-h-[250px] min-h-[150px] flex items-center justify-center">
            <img
              src="/assets/images/dashboard/GrowthAreastop.webp"
              alt="dashboard top background"
              className="absolute top-0 left-0 lg:w-[166px] z-50 w-[100px] h-[100px] lg:h-[134px] object-cover object-top"
            />
            <div className="relative z-10 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl lg:text-3xl font-bold text-[#3D3D3D] mb-1 font-cormorant">
                Growth Areas
              </h3>
              <p className="lg:text-base text-xs text-[#3D3D3D]/60 font-inter">
                These areas need your attention for wellbeing
              </p>
            </div>
            <img
              src="/assets/images/dashboard/GrowthAreasbottom.webp"
              alt="dashboard top background"
              className="absolute bottom-0 right-0 lg:w-[217px] z-50 w-[100px] h-[100px] lg:h-[156px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </section>
  );
};
export default GrowAndGlowSection;
