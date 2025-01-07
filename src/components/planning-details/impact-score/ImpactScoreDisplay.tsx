import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { ImpactFactors } from "./ImpactFactors";

interface ImpactScoreDisplayProps {
  score: number;
  progress: number;
  details?: {
    Environmental?: Record<string, number>;
    Social?: Record<string, number>;
  };
}

export const ImpactScoreDisplay = ({ score, progress, details }: ImpactScoreDisplayProps) => {
  const colorClass = score < 30 
    ? "text-primary bg-primary/10" 
    : score >= 70 
    ? "text-destructive bg-destructive/10" 
    : "text-orange-600 bg-orange-100";

  const scoreText = score < 30 
    ? "Low Impact" 
    : score >= 70 
    ? "High Impact" 
    : "Medium Impact";

  const progressColor = score < 30 
    ? "bg-primary" 
    : score >= 70 
    ? "bg-destructive" 
    : "bg-orange-500";

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Expected Impact Score</h3>
        <p className="text-sm text-muted-foreground">
          Based on environmental and social factors
        </p>
        
        <div className="flex items-center gap-2 mt-4">
          <div className={`p-2 rounded-full ${colorClass}`}>
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-xl">{score}/100</h3>
            <p className="text-sm text-muted-foreground">{scoreText}</p>
          </div>
        </div>

        <Progress 
          value={progress} 
          className={`h-2 mt-2 ${progressColor}`}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
      </div>

      {details && (
        <ImpactFactors 
          environmental={details.Environmental}
          social={details.Social}
        />
      )}
    </Card>
  );
};