import { Card } from "@/components/ui/card";
import { ImpactScoreData } from "./types";
import { ScoreHeader } from "./components/ScoreHeader";
import { ScoreDisplay } from "./components/ScoreDisplay";
import { ImpactFactors } from "./components/ImpactFactors";
import { ImpactedServices } from "./components/ImpactedServices";
import { getScoreExplanation } from "./utils/scoreExplanations";

interface SimpleImpactScoreProps {
  score: number;
  progress: number;
  details?: ImpactScoreData;
  impactedServices?: Record<
    string,
    {
      impact: "positive" | "negative" | "neutral";
      details: string;
    }
  >;
}

export const SimpleImpactScore = ({
  score,
  progress,
  details,
  impactedServices,
}: SimpleImpactScoreProps) => {
  if (!details) return null;

  return (
    <Card className="p-6 space-y-6">
      <ScoreHeader />
      <ScoreDisplay score={score} progress={progress} />

      {details.Environmental && (
        <ImpactFactors
          factors={details.Environmental}
          title="Environmental Factors"
          getScoreExplanation={getScoreExplanation}
        />
      )}

      {details.Social && (
        <ImpactFactors
          factors={details.Social}
          title="Social Factors"
          getScoreExplanation={getScoreExplanation}
        />
      )}

      {impactedServices && Object.keys(impactedServices).length > 0 && (
        <ImpactedServices services={impactedServices} />
      )}
    </Card>
  );
};