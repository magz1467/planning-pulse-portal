import { ScrollArea } from "@/components/ui/scroll-area";
import { ImpactCategoryCard } from "./ImpactCategory";
import { ImpactList } from "./ImpactList";
import { ImpactScoreData, CategoryScore } from "./types";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ImpactScoreBreakdownProps {
  details: ImpactScoreData | null;
}

export const ImpactScoreBreakdown: React.FC<ImpactScoreBreakdownProps> = ({ details }) => {
  console.log('ImpactScoreBreakdown - Received details:', details);

  if (!details) {
    console.log('ImpactScoreBreakdown - No details provided');
    return null;
  }

  // Calculate category scores from detailed breakdowns
  const categoryScores: Record<string, CategoryScore> = {};
  
  if (details.Environmental) {
    const envScore = Object.values(details.Environmental).reduce((a, b) => a + b, 0);
    categoryScores.Environmental = {
      score: envScore / Object.keys(details.Environmental).length,
      details: `Based on analysis of ${Object.entries(details.Environmental)
        .map(([key, value]) => `${key.replace(/_/g, ' ')} (${value})`)
        .join(', ')}.`
    };
  }

  if (details.Social) {
    const socialScore = Object.values(details.Social).reduce((a, b) => a + b, 0);
    categoryScores.Social = {
      score: socialScore / Object.keys(details.Social).length,
      details: `Based on analysis of ${Object.entries(details.Social)
        .map(([key, value]) => `${key.replace(/_/g, ' ')} (${value})`)
        .join(', ')}.`
    };
  }

  console.log('ImpactScoreBreakdown - Calculated category scores:', categoryScores);

  // Order categories for consistent display
  const orderedCategories = ['Environmental', 'Social', 'Infrastructure', 'Economic'];
  const otherCategories = Object.keys(categoryScores).filter(
    cat => !orderedCategories.includes(cat)
  );

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {/* Display ordered categories first */}
        {orderedCategories.map(category => {
          if (!categoryScores[category]) return null;
          return (
            <ImpactCategoryCard 
              key={category}
              category={category}
              scoreData={categoryScores[category]}
            />
          );
        })}

        {/* Display any additional categories */}
        {otherCategories.map(category => {
          if (!categoryScores[category]) return null;
          return (
            <ImpactCategoryCard 
              key={category}
              category={category}
              scoreData={categoryScores[category]}
            />
          );
        })}

        {/* Display impacted services analysis */}
        {details.impacted_services && Object.keys(details.impacted_services).length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Impact on Local Services</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(details.impacted_services).map(([service, { impact, details }]) => (
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

        <ImpactList title="Key Concerns" items={details.key_concerns} />
        <ImpactList title="Recommendations" items={details.recommendations} />
      </div>
    </ScrollArea>
  );
};