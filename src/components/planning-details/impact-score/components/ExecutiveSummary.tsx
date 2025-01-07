import { ImpactScoreData } from "../types";

interface ExecutiveSummaryProps {
  score: number;
  details?: ImpactScoreData;
}

export const ExecutiveSummary = ({ score, details }: ExecutiveSummaryProps) => {
  const getExecutiveSummary = () => {
    let summary = '';
    
    if (score >= 75) {
      summary = "This looks like a really promising development! ";
    } else if (score >= 50) {
      summary = "Overall, this development has some interesting potential. ";
    } else {
      summary = "This development needs careful consideration. ";
    }

    if (details?.Environmental) {
      const highImpactFactors = Object.entries(details.Environmental)
        .filter(([_, score]) => score >= 4)
        .map(([factor]) => factor.toLowerCase());

      if (highImpactFactors.length > 0) {
        summary += `Keep in mind that this development could have a significant impact on ${highImpactFactors.join(" and ")} - these areas will need careful monitoring.`;
      }
    }

    return summary;
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <p className="text-sm text-gray-700">{getExecutiveSummary()}</p>
    </div>
  );
};