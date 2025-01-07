import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";
import { ImpactScoreData } from "./impact-score/types";
import { SimpleImpactScore } from "./impact-score/SimpleImpactScore";
import { useImpactScore } from "@/hooks/use-impact-score";

interface EnvironmentalImpactDialProps {
  score: number;
  details?: ImpactScoreData;
  applicationId: number;
}

export const EnvironmentalImpactDial = ({ 
  score,
  details,
  applicationId 
}: EnvironmentalImpactDialProps) => {
  const { progress } = useImpactScore(applicationId, score, details);

  return (
    <Card className="p-6">
      <SimpleImpactScore 
        score={score} 
        progress={progress} 
        details={details}
      />
    </Card>
  );
};