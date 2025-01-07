import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryScore } from "./types";

interface CategoryImpactProps {
  category: string;
  scoreData: CategoryScore;
}

const getImpactColor = (score: number) => {
  if (score <= 2) return "bg-primary/10 text-primary border-primary/20";
  if (score <= 3) return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-destructive/10 text-destructive border-destructive/20";
};

export const CategoryImpact = ({ category, scoreData }: CategoryImpactProps) => {
  const colorClass = getImpactColor(scoreData.score);
  
  return (
    <Card className="p-6 transition-all hover:shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">
          {category.replace(/_/g, ' ')}
        </h3>
        <Badge 
          variant="outline" 
          className={`${colorClass} px-3 py-1`}
        >
          {scoreData.score.toFixed(1)}/5
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {scoreData.details}
      </p>
    </Card>
  );
};