import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface CategoryScore {
  score: number;
  details: string;
}

interface ImpactScoreDetails {
  category_scores: {
    environmental: CategoryScore;
    social: CategoryScore;
    infrastructure: CategoryScore;
  };
  key_concerns: string[];
  recommendations: string[];
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

export const ImpactScoreBreakdown = ({ details }: ImpactScoreBreakdownProps) => {
  if (!details) return null;

  const impactDetails = details as ImpactScoreDetails;
  const categories = [
    { name: "Environmental", key: "environmental" },
    { name: "Social", key: "social" },
    { name: "Infrastructure", key: "infrastructure" },
  ];

  return (
    <div className="space-y-4">
      {categories.map(({ name, key }) => {
        const categoryData = impactDetails.category_scores[key as keyof typeof impactDetails.category_scores];
        if (!categoryData) return null;

        return (
          <Collapsible key={key}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  {getCategoryIcon(categoryData.score)}
                  <span className={`font-medium ${getCategoryColor(categoryData.score)}`}>
                    {name}: {categoryData.score}/100
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-gray-600 ml-7 mt-2">{categoryData.details}</p>
            </CollapsibleContent>
          </Collapsible>
        );
      })}

      {impactDetails.key_concerns && impactDetails.key_concerns.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <h4 className="font-medium">Key Concerns</h4>
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {impactDetails.key_concerns.map((concern, index) => (
                <li key={index} className="text-sm text-gray-600">{concern}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}

      {impactDetails.recommendations && impactDetails.recommendations.length > 0 && (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <h4 className="font-medium">Recommendations</h4>
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {impactDetails.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600">{recommendation}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};