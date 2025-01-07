import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ImpactScoreData } from "./impact-score/types";
import { useImpactScore } from "@/hooks/use-impact-score";
import { ImpactScoreDisplay } from "./impact-score/ImpactScoreDisplay";
import { CategoryImpact } from "./impact-score/CategoryImpact";
import { ServicesImpact } from "./impact-score/ServicesImpact";
import { Separator } from "@/components/ui/separator";

interface EnvironmentalImpactDialProps {
  score?: number | null;
  details?: ImpactScoreData;
  applicationId: number;
}

export const EnvironmentalImpactDial = ({ 
  score: initialScore, 
  details: initialDetails, 
  applicationId 
}: EnvironmentalImpactDialProps) => {
  console.log('EnvironmentalImpactDial - Received props:', {
    initialScore,
    initialDetails,
    applicationId
  });

  const {
    progress,
    isLoading,
    hasTriggered,
    score,
    details,
    generateScore
  } = useImpactScore(initialScore, initialDetails, applicationId);

  console.log('EnvironmentalImpactDial - After useImpactScore:', {
    progress,
    isLoading,
    hasTriggered,
    score,
    details
  });

  if (!score) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Expected impact score</h3>
          <p className="text-sm text-muted-foreground">
            Impact score calculation is available for this application
          </p>
          <Button 
            onClick={generateScore}
            disabled={isLoading || hasTriggered}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "See impact score"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  // Calculate category scores from detailed breakdowns
  const categoryScores: Record<string, { score: number; details: string }> = {};
  
  if (details?.Environmental) {
    const envScore = Object.values(details.Environmental).reduce((a, b) => a + b, 0);
    categoryScores.Environmental = {
      score: envScore / Object.keys(details.Environmental).length,
      details: `Based on analysis of ${Object.entries(details.Environmental)
        .map(([key, value]) => `${key.replace(/_/g, ' ')} (${value})`)
        .join(', ')}.`
    };
  }

  if (details?.Social) {
    const socialScore = Object.values(details.Social).reduce((a, b) => a + b, 0);
    categoryScores.Social = {
      score: socialScore / Object.keys(details.Social).length,
      details: `Based on analysis of ${Object.entries(details.Social)
        .map(([key, value]) => `${key.replace(/_/g, ' ')} (${value})`)
        .join(', ')}.`
    };
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold">Expected impact score</h3>
        <p className="text-xs text-muted-foreground">
          Score calculated using weighted factors including size, location sensitivity, and development type
        </p>
        <ImpactScoreDisplay score={score} progress={progress} />
      </div>
      
      {details && (
        <div className="space-y-6">
          <Separator className="my-6" />
          
          <div className="space-y-4">
            {Object.entries(categoryScores).map(([category, scoreData]) => (
              <CategoryImpact 
                key={category}
                category={category}
                scoreData={scoreData}
              />
            ))}
          </div>

          {details.impacted_services && (
            <>
              <Separator className="my-6" />
              <ServicesImpact services={details.impacted_services} />
            </>
          )}
        </div>
      )}
    </Card>
  );
};