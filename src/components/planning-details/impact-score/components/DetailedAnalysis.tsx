import { ImpactFactors } from "./ImpactFactors";
import { ImpactedServices } from "./ImpactedServices";
import { ImpactScoreData } from "../types";

interface DetailedAnalysisProps {
  details: ImpactScoreData;
  impactedServices?: Record<string, {
    impact: "positive" | "negative" | "neutral";
    details: string;
  }>;
}

export const DetailedAnalysis = ({ details, impactedServices }: DetailedAnalysisProps) => {
  return (
    <div className="space-y-6">
      {details.Environmental && (
        <ImpactFactors
          factors={details.Environmental}
          title="Environmental Factors"
        />
      )}

      {details.Social && (
        <ImpactFactors
          factors={details.Social}
          title="Social Factors"
        />
      )}

      {impactedServices && Object.keys(impactedServices).length > 0 && (
        <ImpactedServices services={impactedServices} />
      )}
    </div>
  );
};