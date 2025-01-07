import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ScoreDisplay } from "./impact-score/ScoreDisplay";
import { ImpactScoreBreakdown } from "./impact-score/ImpactScoreDetails";
import { useImpactScore } from "@/hooks/use-impact-score";

interface EnvironmentalImpactDialProps {
  score?: number | null;
  details?: Record<string, any>;
  applicationId: number;
}

export const EnvironmentalImpactDial = ({ 
  score: initialScore, 
  details: initialDetails, 
  applicationId 
}: EnvironmentalImpactDialProps) => {
  const {
    progress,
    isLoading,
    hasTriggered,
    score,
    details,
    generateScore
  } = useImpactScore(initialScore, initialDetails, applicationId);

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
          <div className="space-y-2">
            <h4 className="font-medium">Impact Score Breakdown</h4>
            <ImpactScoreBreakdown details={details} />
          </div>

          {details.impacted_services && (
            <div className="space-y-2">
              <h4 className="font-medium">Expected Service Impacts</h4>
              <div className="space-y-2">
                {Object.entries(details.impacted_services).map(([service, data]: [string, any]) => (
                  <div key={service} className="flex items-start space-x-2 text-sm">
                    <span className="font-medium min-w-[100px]">{service}:</span>
                    <span className="text-gray-600">{data.details}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};