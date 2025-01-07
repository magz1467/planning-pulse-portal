import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ScoreDisplay } from "./impact-score/ScoreDisplay";
import { ImpactScoreBreakdown } from "./impact-score/ImpactScoreDetails";
import { useImpactScore } from "@/hooks/use-impact-score";
import { ImpactScoreData } from "./impact-score/types";

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
          <p className="text-sm text-gray-500">
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

  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold">Expected impact score</h3>
        <p className="text-xs text-gray-500">
          Score calculated using weighted factors including size, location sensitivity, and development type
        </p>
        <ScoreDisplay score={score} progress={progress} />
      </div>
      
      {details && (
        <div className="space-y-4 pt-4 border-t">
          <ImpactScoreBreakdown details={details} />
        </div>
      )}
    </Card>
  );
};