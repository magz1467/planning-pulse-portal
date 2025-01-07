import { Card } from "@/components/ui/card";
import { ImpactCategory } from "./types";

export const ImpactCategoryCard = ({ category, scoreData }: ImpactCategory) => {
  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold capitalize mb-2">{category.replace(/_/g, ' ')}</h3>
      <p className={`text-sm font-medium ${getScoreColor(scoreData.score)}`}>
        Impact Score: {scoreData.score}/5
      </p>
      <p className="text-sm mt-2 text-gray-600">{scoreData.details}</p>
    </Card>
  );
};