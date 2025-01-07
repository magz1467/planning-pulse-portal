import { ImpactScoreData } from "../types";

interface ExecutiveSummaryProps {
  score: number;
  impactedServices?: Record<string, {
    impact: "positive" | "negative" | "neutral";
    details: string;
  }>;
  details?: ImpactScoreData;
}

export const ExecutiveSummary = ({ score, impactedServices, details }: ExecutiveSummaryProps) => {
  const getExecutiveSummary = () => {
    const positiveCount = Object.values(impactedServices || {}).filter(s => s.impact === "positive").length;
    const negativeCount = Object.values(impactedServices || {}).filter(s => s.impact === "negative").length;
    
    // Get the most significant impacts
    const significantImpacts = Object.entries(impactedServices || {})
      .filter(([_, data]) => data.impact !== "neutral")
      .map(([service, data]) => ({
        service,
        impact: data.impact,
        details: data.details
      }))
      .slice(0, 2);

    let summary = '';
    
    if (score >= 75) {
      summary = "This looks like a really promising development! ";
    } else if (score >= 50) {
      summary = "Overall, this development has some interesting potential. ";
    } else {
      summary = "This development needs careful consideration. ";
    }

    if (positiveCount > negativeCount) {
      summary += `It could bring ${positiveCount} key benefits to the area`;
      if (negativeCount > 0) {
        summary += `, though there are ${negativeCount} aspects we should keep an eye on`;
      }
    } else if (negativeCount > positiveCount) {
      summary += `There are ${negativeCount} important concerns to consider`;
      if (positiveCount > 0) {
        summary += `, although it does offer ${positiveCount} potential benefits`;
      }
    } else {
      summary += `It has a mixed impact with ${positiveCount} potential benefits and ${negativeCount} challenges to consider`;
    }

    if (significantImpacts.length > 0) {
      summary += ". Specifically, it ";
      const impactPhrases = significantImpacts.map(impact => {
        if (impact.impact === "positive") {
          return `could improve ${impact.service.toLowerCase()}`;
        } else {
          return `might put pressure on ${impact.service.toLowerCase()}`;
        }
      });
      summary += impactPhrases.join(" and ");
    }

    if (details?.Environmental) {
      const highImpactFactors = Object.entries(details.Environmental)
        .filter(([_, score]) => score >= 4)
        .map(([factor]) => factor.toLowerCase());

      if (highImpactFactors.length > 0) {
        summary += `. Keep in mind that this development could have a significant impact on ${highImpactFactors.join(" and ")} - these areas will need careful monitoring`;
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