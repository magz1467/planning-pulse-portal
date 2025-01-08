import { Card } from "@/components/ui/card";
import { ImpactCategoryCard } from "./ImpactCategory";

interface ImpactListProps {
  key: string;
  category: string;
  score: number;
  maxScore: number;
}

interface ImpactCategory {
  key: string;
  category: string;
  details: any;
}

export const ImpactScoreDetails = ({ impactDetails }: { impactDetails: any }) => {
  if (!impactDetails) return null;

  const calculateTotalScore = () => {
    let total = 0;
    let count = 0;
    Object.entries(impactDetails).forEach(([_, value]: [string, any]) => {
      if (typeof value.score === 'number') {
        total += value.score;
        count++;
      }
    });
    return count > 0 ? Math.round(total / count) : 0;
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Overall Impact Score: {totalScore}%</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              totalScore >= 75 ? "bg-red-500" :
              totalScore >= 50 ? "bg-yellow-500" :
              "bg-green-500"
            }`}
            style={{ width: `${totalScore}%` }}
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {Object.entries(impactDetails).map(([key, value]: [string, any]) => (
          <ImpactCategoryCard
            key={key}
            category={key}
            score={value.score || 0}
            maxScore={100}
          />
        ))}
      </div>
    </div>
  );
};