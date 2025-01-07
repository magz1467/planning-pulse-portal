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

  // Create executive summary from key impacts
  const getExecutiveSummary = () => {
    const positiveCount = Object.values(impactedServices || {}).filter(s => s.impact === "positive").length;
    const negativeCount = Object.values(impactedServices || {}).filter(s => s.impact === "negative").length;
    
    return `This development has ${positiveCount} positive and ${negativeCount} negative potential impacts on local services and infrastructure.`;
  };

  return (
    <Card className="p-6 space-y-6">
      <ScoreHeader />
      <ScoreDisplay score={score} progress={progress} />
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">{getExecutiveSummary()}</p>
      </div>

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