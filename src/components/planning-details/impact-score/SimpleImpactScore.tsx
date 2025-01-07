import { Card } from "@/components/ui/card";
import { ImpactScoreData } from "./types";
import { ScoreHeader } from "./components/ScoreHeader";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { FactorScores } from "./components/FactorScores";
import { DetailedAnalysis } from "./components/DetailedAnalysis";
import { Application } from "@/types/planning";

export interface SimpleImpactScoreProps {
  score: number;
  progress: number;
  details?: ImpactScoreData;
  application?: Application;
}

export const SimpleImpactScore = ({
  score,
  progress,
  details,
  application
}: SimpleImpactScoreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!details) return null;

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
      
      <ExecutiveSummary 
        score={score}
        details={details}
        application={application}
      />

      <FactorScores factorScores={factorScores} />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
          View detailed analysis
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-4">
          <DetailedAnalysis 
            details={details}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};