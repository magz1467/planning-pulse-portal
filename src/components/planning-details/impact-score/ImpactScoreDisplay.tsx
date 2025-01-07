import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { AlertCircle, Leaf, Users } from "lucide-react";

interface ImpactScoreDisplayProps {
  score: number;
  progress: number;
  details?: {
    Environmental?: Record<string, number>;
    Social?: Record<string, number>;
  };
}

export const ImpactScoreDisplay = ({ score, progress, details }: ImpactScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return "text-primary bg-primary/10";
    if (score >= 70) return "text-destructive bg-destructive/10";
    return "text-orange-600 bg-orange-100";
  };

  const getScoreText = (score: number) => {
    if (score < 30) return "Low Impact";
    if (score >= 70) return "High Impact";
    return "Medium Impact";
  };

  const colorClass = getScoreColor(score);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Expected Impact Score</h3>
        <p className="text-sm text-muted-foreground">
          Score calculated using weighted environmental and social factors
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${colorClass}`}>
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">{score}/100</h3>
              <p className="text-sm text-muted-foreground">{getScoreText(score)}</p>
            </div>
          </div>
        </div>

        <Progress 
          value={progress} 
          className="h-2 mt-2"
          className={score < 30 ? "bg-primary" : score >= 70 ? "bg-destructive" : "bg-orange-500"}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
      </div>

      {details && (
        <div className="space-y-4 mt-6 pt-6 border-t">
          {details.Environmental && (
            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Environmental Factors</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Including noise, air quality, biodiversity and water quality impacts
                </p>
              </div>
            </div>
          )}

          {details.Social && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Social Factors</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Including community impact, local economy and public health
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};