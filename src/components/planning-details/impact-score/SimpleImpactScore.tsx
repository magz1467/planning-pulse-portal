import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { ImpactScoreData } from "./types";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface SimpleImpactScoreProps {
  score: number;
  progress: number;
  details?: ImpactScoreData;
}

export const SimpleImpactScore = ({ score, progress, details }: SimpleImpactScoreProps) => {
  if (!details) return null;

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-emerald-600 dark:text-emerald-400";
    if (score <= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getImpactText = (score: number) => {
    if (score <= 30) return "Low Impact";
    if (score <= 60) return "Moderate Impact";
    return "High Impact";
  };

  const getServiceImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'negative':
        return 'text-rose-600 dark:text-rose-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Estimated Impact</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">This score is generated using AI analysis of the planning application details. We evaluate potential impacts on air quality, noise, biodiversity, and community aspects on a scale of 1-5, then normalize to a 0-100 scale for easier understanding.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </span>
          <span className="text-sm text-muted-foreground">{getImpactText(score)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {details.Environmental && (
        <div>
          <h4 className="font-medium mb-2 text-sm">Environmental Factors</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(details.Environmental).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{value}/5</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {details.Social && (
        <div>
          <h4 className="font-medium mb-2 text-sm">Social Factors</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(details.Social).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{value}/5</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {details.impacted_services && Object.keys(details.impacted_services).length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Impact on Local Services</h4>
            <div className="grid gap-3">
              {Object.entries(details.impacted_services).map(([service, data]) => (
                <div 
                  key={service} 
                  className="text-sm space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{service}</span>
                    <span className={getServiceImpactColor(data.impact)}>
                      {data.impact.charAt(0).toUpperCase() + data.impact.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {data.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};