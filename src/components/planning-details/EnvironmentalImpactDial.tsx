import { Card } from "@/components/ui/card";
import { AlertCircle, InfoIcon } from "lucide-react";
import { useImpactScore } from "@/hooks/use-impact-score";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnvironmentalImpactDialProps {
  score: number | null;
  details: any;
  applicationId: number;
}

export const EnvironmentalImpactDial = ({ 
  score,
  details,
  applicationId 
}: EnvironmentalImpactDialProps) => {
  const { progress } = useImpactScore(score, details, applicationId);

  const getColor = (score: number) => {
    if (score < 30) return '#22c55e';
    if (score >= 70) return '#ea384c';
    const orangeIntensity = (score - 30) / 40;
    const start = { r: 254, g: 198, b: 161 };
    const end = { r: 249, g: 115, b: 22 };
    const r = Math.round(start.r + (end.r - start.r) * orangeIntensity);
    const g = Math.round(start.g + (end.g - start.g) * orangeIntensity);
    const b = Math.round(start.b + (end.b - start.b) * orangeIntensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getImpactText = (score: number) => {
    if (score < 30) return "Low Impact";
    if (score >= 70) return "High Impact";
    return "Moderate Impact";
  };

  const getImpactedServicesText = () => {
    if (!details?.impacted_services) return "";
    const positive = Object.values(details.impacted_services).filter((s: any) => s.impact === 'positive').length;
    const negative = Object.values(details.impacted_services).filter((s: any) => s.impact === 'negative').length;
    return `${positive} services may improve, ${negative} services may face added pressure`;
  };

  if (!score) return null;

  const color = getColor(score);
  const impactText = getImpactText(score);
  const servicesText = getImpactedServicesText();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Estimated Impact</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-sm">
                    Impact score is calculated based on various factors including environmental and social impacts
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold" style={{ color }}>
              {score}/100
            </span>
            <span className="text-sm text-gray-500">
              ({impactText})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-2"
          style={{
            background: '#F2FCE2',
            '--progress-background': color
          } as React.CSSProperties}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
      </div>

      {servicesText && (
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{servicesText}</p>
          </div>
        </div>
      )}

      {details?.key_concerns && details.key_concerns.length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>This raises some concerns that need to be addressed</p>
          </div>
        </div>
      )}
    </Card>
  );
};