import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface CategoryScore {
  score: number;
  details: string;
}

interface ImpactScoreDetails {
  category_scores?: {
    environmental?: CategoryScore;
    social?: CategoryScore;
    infrastructure?: CategoryScore;
  };
  key_concerns?: string[];
  recommendations?: string[];
}

interface ImpactScoreBreakdownProps {
  details?: Record<string, any>;
}

const getCategoryIcon = (score: number) => {
  if (score <= 30) return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (score >= 70) return <AlertTriangle className="h-5 w-5 text-red-500" />;
  return <Info className="h-5 w-5 text-orange-500" />;
};

const getCategoryColor = (score: number) => {
  if (score <= 30) return "text-green-700";
  if (score >= 70) return "text-red-700";
  return "text-orange-700";
};

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'positive':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'negative':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export const ImpactScoreBreakdown = ({ details }: ImpactScoreBreakdownProps) => {
  if (!details) return null;

  // Filter out impacted_services from categories
  const categories = Object.entries(details).filter(([key]) => 
    key !== 'impacted_services' && typeof details[key] === 'object'
  );

  const impactedServices = details.impacted_services || {};

  return (
    <div className="space-y-4">
      {/* Category Scores */}
      <div className="space-y-2">
        <h4 className="font-medium">Category Scores</h4>
        {categories.map(([category, scores]) => (
          <Collapsible key={category}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(Object.values(scores as Record<string, number>).reduce((acc, curr) => acc + curr, 0) / Object.keys(scores).length)}
                  <span className={`font-medium capitalize`}>
                    {category}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-7 mt-2 space-y-1">
                {Object.entries(scores as Record<string, number>).map(([subCategory, score]) => (
                  <div key={subCategory} className="text-sm flex justify-between">
                    <span className="capitalize">{subCategory.replace(/_/g, ' ')}</span>
                    <span className={getCategoryColor(score)}>{score}/5</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Impacted Services */}
      {Object.keys(impactedServices).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Impact on Services</h4>
          {Object.entries(impactedServices).map(([service, data]: [string, any]) => (
            <Collapsible key={service}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    {getImpactIcon(data.impact)}
                    <span className="font-medium">{service}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-7 mt-2">
                  <p className="text-sm text-gray-600">{data.details}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
};