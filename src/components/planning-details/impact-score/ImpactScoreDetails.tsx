import { ScrollArea } from "@/components/ui/scroll-area";
import { ImpactCategoryCard } from "./ImpactCategory";
import { ImpactList } from "./ImpactList";
import { ImpactScoreData } from "./types";

interface ImpactScoreBreakdownProps {
  details: ImpactScoreData | null;
}

export const ImpactScoreBreakdown: React.FC<ImpactScoreBreakdownProps> = ({ details }) => {
  if (!details) return null;

  const { key_concerns, recommendations, ...categories } = details;

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {Object.entries(categories).map(([category, scoreData]) => (
          <ImpactCategoryCard 
            key={category}
            category={category}
            scoreData={scoreData}
          />
        ))}

        <ImpactList title="Key Concerns" items={key_concerns} />
        <ImpactList title="Recommendations" items={recommendations} />
      </div>
    </ScrollArea>
  );
};