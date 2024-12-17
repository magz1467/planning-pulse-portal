import { Card } from "@/components/ui/card";
import { AlertCircle, MinusCircle, ChevronDown } from "lucide-react";
import { Application } from "@/types/planning";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { useState } from "react";

interface ImpactArea {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface ExpectedImpactAreasProps {
  application?: Application;
}

export const ExpectedImpactAreas = ({ application }: ExpectedImpactAreasProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!application) return null;

  // In a real application, this would come from the backend
  const impactAreas: ImpactArea[] = [
    { name: "Schools", impact: "positive" },
    { name: "Health", impact: "neutral" },
    { name: "Roads", impact: "negative" },
    { name: "Public Transport", impact: "positive" },
    { name: "Utilities", impact: "neutral" },
    { name: "Community Services", impact: "positive" },
  ];

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <AlertCircle className="w-4 h-4 text-primary" />;
      case 'negative':
        return <AlertCircle className="w-4 h-4 text-[#ea384c]" />;
      default:
        return <MinusCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'May support these services';
      case 'negative':
        return 'May increase pressure on services';
      default:
        return 'No significant impact expected';
    }
  };

  const getImpactClass = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-primary/5 p-2 rounded-lg';
      case 'negative':
        return 'bg-[#ea384c]/5 p-2 rounded-lg';
      default:
        return 'p-2';
    }
  };

  // Count impacts by type
  const impactCounts = impactAreas.reduce((acc, area) => {
    acc[area.impact] = (acc[area.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Impacted Services</h3>
            <p className="text-sm text-gray-500">
              {impactCounts.positive || 0} services may be supported,{' '}
              {impactCounts.negative || 0} may face pressure
            </p>
          </div>
          <CollapsibleTrigger className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {impactAreas.map((area) => (
              <div 
                key={area.name} 
                className={`flex items-start gap-2 group transition-all ${getImpactClass(area.impact)}`}
                title={getImpactLabel(area.impact)}
              >
                {getImpactIcon(area.impact)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{area.name}</span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {getImpactLabel(area.impact)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <AlertCircle className="w-3 h-3 text-primary" />
              <span>May support these services</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <AlertCircle className="w-3 h-3 text-[#ea384c]" />
              <span>May increase pressure on services</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <MinusCircle className="w-3 h-3 text-gray-400" />
              <span>No significant impact expected</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};