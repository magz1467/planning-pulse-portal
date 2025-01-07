import { Card } from "@/components/ui/card";
import { SimpleImpactScore } from "./impact-score/SimpleImpactScore";
import { useImpactScore } from "@/hooks/use-impact-score";

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