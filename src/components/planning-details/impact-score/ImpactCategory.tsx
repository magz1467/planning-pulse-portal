import { Card } from "@/components/ui/card";
import { ImpactCategory } from "./types";

export const ImpactCategoryCard = ({ category, scoreData }: ImpactCategory) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold capitalize mb-2">{category.replace(/_/g, ' ')}</h3>
      <p className="text-sm text-gray-600">Score: {scoreData.score}</p>
      <p className="text-sm mt-2">{scoreData.details}</p>
    </Card>
  );
};