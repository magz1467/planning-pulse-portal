import { Card } from "@/components/ui/card";
import { ImpactCategory } from "./types";
import { Badge } from "@/components/ui/badge";

export const ImpactCategoryCard = ({ category, scoreData }: ImpactCategory) => {
  const getScoreColor = (score: number) => {
    if (score <= 2) return 'bg-green-100 text-green-800 border-green-300';
    if (score <= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 2) return 'Low Impact';
    if (score <= 3) return 'Medium Impact';
    return 'High Impact';
  };

  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">
          {category.replace(/_/g, ' ')}
        </h3>
        <Badge 
          variant="outline" 
          className={`${getScoreColor(scoreData.score)} px-3 py-1`}
        >
          {scoreData.score.toFixed(1)}/5 - {getScoreLabel(scoreData.score)}
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">
        {scoreData.details}
      </p>
    </Card>
  );
};