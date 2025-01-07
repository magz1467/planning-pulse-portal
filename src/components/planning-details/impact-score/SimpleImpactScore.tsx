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

interface SimpleImpactScoreProps {
  score: number;
  progress: number;
  details?: ImpactScoreData;
}

export const SimpleImpactScore = ({ score, progress, details }: SimpleImpactScoreProps) => {
  if (!details) return null;

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-green-600";
    if (score <= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getImpactText = (score: number) => {
    if (score <= 30) return "Low Impact";
    if (score <= 60) return "Moderate Impact";
    return "High Impact";
  };

  const getServiceImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Environmental Impact Assessment</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>This score is generated using AI analysis of the planning application details, considering environmental and social factors. The assessment evaluates potential impacts on air quality, noise, biodiversity, and community aspects.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </span>
          <span className="text-sm text-gray-600">{getImpactText(score)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Environmental Factors</h4>
          <div className="space-y-1">
            {Object.entries(details.Environmental || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{value}/5</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Social Factors</h4>
          <div className="space-y-1">
            {Object.entries(details.Social || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{value}/5</span>
              </div>
            ))}
          </div>
        </div>

        {details.impacted_services && (
          <div>
            <h4 className="font-medium mb-2">Service Impacts</h4>
            <div className="space-y-1">
              {Object.entries(details.impacted_services).map(([service, data]) => (
                <div key={service} className="text-sm">
                  <div className="flex justify-between">
                    <span className="capitalize">{service}</span>
                    <span className={`font-medium ${getServiceImpactColor(data.impact)}`}>
                      {data.impact.charAt(0).toUpperCase() + data.impact.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-0.5">{data.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};