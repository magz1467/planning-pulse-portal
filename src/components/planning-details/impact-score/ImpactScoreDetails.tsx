import { ScrollArea } from "@/components/ui/scroll-area";
import { ImpactCategoryCard } from "./ImpactCategory";
import { ImpactList } from "./ImpactList";
import { ImpactScoreData } from "./types";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ImpactScoreBreakdownProps {
  details: ImpactScoreData | null;
}

export const ImpactScoreBreakdown: React.FC<ImpactScoreBreakdownProps> = ({ details }) => {
  if (!details) return null;

  const { impact_scores, key_concerns, recommendations, impacted_services } = details;

  // Order categories for consistent display
  const orderedCategories = ['environmental', 'social', 'infrastructure', 'economic'];
  const otherCategories = Object.keys(impact_scores).filter(
    cat => !orderedCategories.includes(cat)
  );

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {/* Display ordered categories first */}
        {orderedCategories.map(category => {
          const scoreData = impact_scores[category];
          if (!scoreData) return null;
          return (
            <ImpactCategoryCard 
              key={category}
              category={category}
              scoreData={scoreData}
            />
          );
        })}

        {/* Display any additional categories */}
        {otherCategories.map(category => {
          const scoreData = impact_scores[category];
          if (!scoreData) return null;
          return (
            <ImpactCategoryCard 
              key={category}
              category={category}
              scoreData={scoreData}
            />
          );
        })}

        {/* Display impacted services analysis */}
        {impacted_services && Object.keys(impacted_services).length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Impact on Local Services</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(impacted_services).map(([service, { impact, details }]) => (
                <div 
                  key={service} 
                  className={`flex items-start gap-2 group transition-all ${
                    impact === 'positive' ? 'bg-primary/5' : 
                    impact === 'negative' ? 'bg-destructive/5' : 
                    'bg-muted/5'
                  } p-2 rounded-lg`}
                  title={details}
                >
                  <AlertCircle className={`h-5 w-5 ${
                    impact === 'positive' ? 'text-primary' : 
                    impact === 'negative' ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{service}</span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {details}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <AlertCircle className="w-3 h-3 text-primary" />
                <span>May support these services</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <AlertCircle className="w-3 h-3 text-destructive" />
                <span>May increase pressure on services</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                <span>No significant impact expected</span>
              </div>
            </div>
          </Card>
        )}

        <ImpactList title="Key Concerns" items={key_concerns} />
        <ImpactList title="Recommendations" items={recommendations} />
      </div>
    </ScrollArea>
  );
};