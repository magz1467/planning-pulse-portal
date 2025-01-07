import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Info } from "lucide-react";
import { ImpactScoreData } from "./types";

interface SimpleImpactScoreProps {
  score: number;
  progress: number;
  details?: ImpactScoreData;
}

export const SimpleImpactScore = ({ score, progress, details }: SimpleImpactScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return "text-primary";
    if (score >= 70) return "text-destructive";
    return "text-orange-600";
  };

  const getProgressColor = (score: number) => {
    if (score < 30) return "bg-primary";
    if (score >= 70) return "bg-destructive";
    return "bg-orange-500";
  };

  const getScoreText = (score: number) => {
    if (score < 30) return "Low Impact";
    if (score >= 70) return "High Impact";
    return "Medium Impact";
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className={`h-5 w-5 ${getScoreColor(score)}`} />
            <h3 className="font-semibold text-lg">Expected Impact Score</h3>
          </div>
          <div className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </div>
        </div>
        
        <Progress 
          value={progress} 
          className={`h-2 ${getProgressColor(score)}`} 
        />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Low Impact</span>
          <span>{getScoreText(score)}</span>
          <span>High Impact</span>
        </div>
      </div>

      {details && (
        <div className="space-y-4">
          {details.Environmental && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" />
                <h4 className="font-medium">Environmental Factors</h4>
              </div>
              <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
                {Object.entries(details.Environmental)
                  .filter(([_, value]) => value > 2) // Only show significant impacts
                  .map(([key, value]) => (
                    <li key={key}>
                      {key.replace(/_/g, ' ')}: {value}/5
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {details.Social && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" />
                <h4 className="font-medium">Social Factors</h4>
              </div>
              <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
                {Object.entries(details.Social)
                  .filter(([_, value]) => value > 2) // Only show significant impacts
                  .map(([key, value]) => (
                    <li key={key}>
                      {key.replace(/_/g, ' ')}: {value}/5
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {details.impacted_services && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-4 w-4" />
                <h4 className="font-medium">Service Impacts</h4>
              </div>
              <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
                {Object.entries(details.impacted_services)
                  .filter(([_, data]) => data.impact !== 'neutral')
                  .map(([service, data]) => (
                    <li key={service} className={data.impact === 'positive' ? 'text-primary' : 'text-destructive'}>
                      {service}: {data.impact}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};