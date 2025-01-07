import { ImpactScoreData } from "../types";

interface ExecutiveSummaryProps {
  score: number;
  details?: ImpactScoreData;
  application?: {
    description?: string;
    type?: string;
    development_type?: string;
  };
}

export const ExecutiveSummary = ({ score, details, application }: ExecutiveSummaryProps) => {
  const getExecutiveSummary = () => {
    let summary = '';
    const description = application?.description || '';
    const devType = application?.development_type || application?.type || '';
    
    // Base summary on score range
    if (score >= 75) {
      summary = `This ${devType.toLowerCase()} appears to be a well-considered development proposal. `;
    } else if (score >= 50) {
      summary = `This ${devType.toLowerCase()} shows promise but requires careful consideration. `;
    } else {
      summary = `This ${devType.toLowerCase()} raises some concerns that need to be addressed. `;
    }

    // Add environmental impact details if available
    if (details?.Environmental) {
      const highImpactFactors = Object.entries(details.Environmental)
        .filter(([_, score]) => score >= 4)
        .map(([factor]) => factor.toLowerCase().replace(/_/g, ' '));

      const lowImpactFactors = Object.entries(details.Environmental)
        .filter(([_, score]) => score <= 2)
        .map(([factor]) => factor.toLowerCase().replace(/_/g, ' '));

      if (highImpactFactors.length > 0) {
        summary += `The main environmental considerations are around ${highImpactFactors.join(" and ")}, which will need careful monitoring. `;
      }
      if (lowImpactFactors.length > 0) {
        summary += `The proposal shows good management of ${lowImpactFactors.join(" and ")}. `;
      }
    }

    // Add social impact details if available
    if (details?.Social) {
      const significantSocialImpacts = Object.entries(details.Social)
        .filter(([_, score]) => score >= 3)
        .map(([factor]) => factor.toLowerCase().replace(/_/g, ' '));

      if (significantSocialImpacts.length > 0) {
        summary += `The development will have notable effects on ${significantSocialImpacts.join(" and ")} in the local area. `;
      }
    }

    // Add specific details from the application description
    if (description) {
      if (description.toLowerCase().includes('extension')) {
        summary += 'As this is an extension project, the impacts are relatively localized. ';
      } else if (description.toLowerCase().includes('new build') || description.toLowerCase().includes('construction')) {
        summary += 'Being a new construction, careful consideration of the construction phase impacts will be important. ';
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