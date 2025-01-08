import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ImpactCategoryProps {
  category: string;
  score: number;
  maxScore: number;
}

export const ImpactCategoryCard = ({ category, score, maxScore }: ImpactCategoryProps) => {
  const getImpactLevel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 75) return 'High Impact';
    if (percentage >= 50) return 'Medium Impact';
    return 'Low Impact';
  };

  // Safely handle undefined category
  if (!category) {
    return null;
  }

  // Format category name by replacing underscores with spaces and capitalizing
  const formattedCategory = category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {formattedCategory}
        </h3>
        <Badge 
          variant="outline"
          className={cn(
            score >= 75 ? "border-red-200 bg-red-100 text-red-800" :
            score >= 50 ? "border-yellow-200 bg-yellow-100 text-yellow-800" :
            "border-green-200 bg-green-100 text-green-800"
          )}
        >
          {getImpactLevel(score, maxScore)}
        </Badge>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={cn(
            "h-2.5 rounded-full",
            score >= 75 ? "bg-red-500" :
            score >= 50 ? "bg-yellow-500" :
            "bg-green-500"
          )}
          style={{ width: `${(score / maxScore) * 100}%` }}
        />
      </div>
    </Card>
  );
};