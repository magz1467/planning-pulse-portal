import { Card } from "@/components/ui/card";
import { AlertCircle, CircleDot, MinusCircle } from "lucide-react";
import { Application } from "@/types/planning";

interface ImpactArea {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface ExpectedImpactAreasProps {
  application?: Application;
}

export const ExpectedImpactAreas = ({ application }: ExpectedImpactAreasProps) => {
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
        return 'This service may need additional capacity';
      case 'negative':
        return 'This development may increase pressure on this service';
      default:
        return 'No significant impact expected on this service';
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

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Impacted Services</h3>
          <p className="text-sm text-gray-500 mt-1">
            How this development may affect local services
          </p>
        </div>

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

        <div className="border-t pt-3 mt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle className="w-3 h-3 text-primary" />
            <span>Additional capacity may be needed</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <AlertCircle className="w-3 h-3 text-[#ea384c]" />
            <span>May increase service pressure</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <MinusCircle className="w-3 h-3 text-gray-400" />
            <span>No significant impact expected</span>
          </div>
        </div>
      </div>
    </Card>
  );
};