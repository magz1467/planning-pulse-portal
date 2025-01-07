import { Card } from "@/components/ui/card";
import { ImpactScoreData } from "./types";
import { ScoreHeader } from "./components/ScoreHeader";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { ImpactFactors } from "./components/ImpactFactors";
import { ImpactedServices } from "./components/ImpactedServices";
import { getScoreExplanation } from "./utils/scoreExplanations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SimpleImpactScoreProps {
  score: number;
  progress: number;
  details?: ImpactScoreData;
  impactedServices?: Record<
    string,
    {
      impact: "positive" | "negative" | "neutral";
      details: string;
    }
  >;
}

export const SimpleImpactScore = ({
  score,
  progress,
  details,
  impactedServices,
}: SimpleImpactScoreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!details) return null;

  // Enhanced executive summary that includes more key features
  const getExecutiveSummary = () => {
    const positiveCount = Object.values(impactedServices || {}).filter(s => s.impact === "positive").length;
    const negativeCount = Object.values(impactedServices || {}).filter(s => s.impact === "negative").length;
    const neutralCount = Object.values(impactedServices || {}).filter(s => s.impact === "neutral").length;
    
    // Get the most significant impacts
    const significantImpacts = Object.entries(impactedServices || {})
      .filter(([_, data]) => data.impact !== "neutral")
      .map(([service, data]) => ({
        service,
        impact: data.impact,
        details: data.details
      }))
      .slice(0, 2); // Get top 2 most significant impacts

    let summary = `This development has ${positiveCount} positive and ${negativeCount} negative potential impacts`;
    
    // Add specific impacts if available
    if (significantImpacts.length > 0) {
      summary += ", notably ";
      summary += significantImpacts
        .map(impact => `${impact.impact === "positive" ? "supporting" : "affecting"} ${impact.service.toLowerCase()}`)
        .join(" and ");
    }
    
    // Add environmental context if available
    if (details.Environmental) {
      const envFactors = Object.keys(details.Environmental);
      if (envFactors.length > 0) {
        summary += `. Environmental considerations include ${envFactors.slice(0, 2).join(" and ")}`;
      }
    }

    summary += ".";
    return summary;
  };

  // Calculate average scores for Environmental and Social factors
  const getFactorScores = () => {
    const scores: { [key: string]: number } = {};
    
    if (details.Environmental) {
      const envValues = Object.values(details.Environmental);
      scores.Environmental = envValues.reduce((a, b) => a + b, 0) / envValues.length;
    }
    
    if (details.Social) {
      const socialValues = Object.values(details.Social);
      scores.Social = socialValues.reduce((a, b) => a + b, 0) / socialValues.length;
    }
    
    return scores;
  };

  const factorScores = getFactorScores();

  return (
    <Card className="p-6 space-y-6">
      <ScoreHeader />
      <ScoreDisplay score={score} progress={progress} />
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">{getExecutiveSummary()}</p>
      </div>

      {/* Display Environmental and Social Scores */}
      {Object.keys(factorScores).length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {Object.entries(factorScores).map(([factor, score]) => (
            <div key={factor} className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-sm text-gray-600">{factor} Impact</h4>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {score.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  out of 5
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
          View detailed analysis
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-4 space-y-6">
          {details.Environmental && (
            <ImpactFactors
              factors={details.Environmental}
              title="Environmental Factors"
              getScoreExplanation={getScoreExplanation}
            />
          )}

          {details.Social && (
            <ImpactFactors
              factors={details.Social}
              title="Social Factors"
              getScoreExplanation={getScoreExplanation}
            />
          )}

          {impactedServices && Object.keys(impactedServices).length > 0 && (
            <ImpactedServices services={impactedServices} />
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};