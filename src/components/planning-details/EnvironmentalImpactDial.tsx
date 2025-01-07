import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ImpactScoreData } from "./impact-score/types";
import { useImpactScore } from "@/hooks/use-impact-score";
import { SimpleImpactScore } from "./impact-score/SimpleImpactScore";

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
      <div className="space-y-2 p-6 bg-white rounded-lg border">
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
    );
  }

  return (
    <SimpleImpactScore
      score={score}
      progress={progress}
      details={details}
      impactedServices={details?.impacted_services}
    />
  );
};