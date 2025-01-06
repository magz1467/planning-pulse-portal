import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface CategoryScore {
  score: number;
  details: string;
}

interface ImpactScoreDetails {
  category_scores: {
    environmental: CategoryScore;
    social: CategoryScore;
    infrastructure: CategoryScore;
  };
  key_concerns: string[];
  recommendations: string[];
}

interface ImpactScoreBreakdownProps {
  details?: Record<string, any>;
}

const getCategoryIcon = (score: number) => {
  if (score <= 30) return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (score >= 70) return <AlertTriangle className="h-5 w-5 text-red-500" />;
  return <Info className="h-5 w-5 text-orange-500" />;
};

const getCategoryColor = (score: number) => {
  if (score <= 30) return "text-green-700";
  if (score >= 70) return "text-red-700";
  return "text-orange-700";
};

export const ImpactScoreBreakdown = ({ details }: ImpactScoreBreakdownProps) => {
  if (!details) return null;

  const impactDetails = details as ImpactScoreDetails;
  const categories = [
    { name: "Environmental", key: "environmental" },
    { name: "Social", key: "social" },
    { name: "Infrastructure", key: "infrastructure" },
  ];

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">Impact Score Breakdown</h3>
      
      <div className="space-y-4">
        {categories.map(({ name, key }) => {
          const categoryData = impactDetails.category_scores[key as keyof typeof impactDetails.category_scores];
          if (!categoryData) return null;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(categoryData.score)}
                <span className={`font-medium ${getCategoryColor(categoryData.score)}`}>
                  {name}: {categoryData.score}/100
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-7">{categoryData.details}</p>
            </div>
          );
        })}
      </div>

      {impactDetails.key_concerns && impactDetails.key_concerns.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Key Concerns</h4>
          <ul className="list-disc pl-5 space-y-1">
            {impactDetails.key_concerns.map((concern, index) => (
              <li key={index} className="text-sm text-gray-600">{concern}</li>
            ))}
          </ul>
        </div>
      )}

      {impactDetails.recommendations && impactDetails.recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Recommendations</h4>
          <ul className="list-disc pl-5 space-y-1">
            {impactDetails.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-600">{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};