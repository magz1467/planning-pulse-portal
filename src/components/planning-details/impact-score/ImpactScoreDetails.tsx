import { Application } from "@/types/planning";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImpactCategoryCard } from "./ImpactCategory";
import { ImpactList } from "./ImpactList";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ImpactScoreDetailsProps {
  application: Application;
}

export const ImpactScoreDetails = ({ application }: ImpactScoreDetailsProps) => {
  const details = application.impact_score_details;

  if (!details) {
    return null;
  }

  const calculateTotalScore = (category: Record<string, number>) => {
    return Object.values(category).reduce((sum, score) => sum + score, 0);
  };

  const calculateMaxScore = (category: Record<string, number>) => {
    return Object.keys(category).length * 5;
  };

  const renderCategory = (categoryName: string, categoryData: Record<string, number>) => {
    const totalScore = calculateTotalScore(categoryData);
    const maxScore = calculateMaxScore(categoryData);
    const percentage = (totalScore / maxScore) * 100;

    return (
      <div key={categoryName} className="space-y-4">
        <h3 className="text-lg font-semibold">{categoryName}</h3>
        <div className="grid gap-4">
          {Object.entries(categoryData).map(([subCategory, score]) => (
            <ImpactList
              key={subCategory}
              label={subCategory.replace(/_/g, ' ')}
              score={score}
              maxScore={5}
            />
          ))}
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Category Score: {totalScore}/{maxScore} ({Math.round(percentage)}%)
          </p>
        </div>
        <Separator className="my-4" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">Impact Assessment</h2>
      </div>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-8">
          {Object.entries(details).map(([category, categoryData]) => (
            <ImpactCategoryCard
              key={category}
              title={category}
              details={categoryData}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};