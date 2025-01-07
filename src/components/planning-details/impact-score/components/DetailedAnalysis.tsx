import { ImpactFactors } from "./ImpactFactors";
import { ImpactScoreData } from "../types";

interface DetailedAnalysisProps {
  details: ImpactScoreData;
}

export const DetailedAnalysis = ({ details }: DetailedAnalysisProps) => {
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
    </div>
  );
};