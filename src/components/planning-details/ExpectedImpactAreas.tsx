import { Card } from "@/components/ui/card";
import { Check, X, Minus } from "lucide-react";
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
  // For now, we'll generate mock impacts
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
        return <Check className="w-4 h-4 text-primary" />;
      case 'negative':
        return <X className="w-4 h-4 text-[#ea384c]" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Expected Impact Areas</h3>
      <div className="grid grid-cols-2 gap-4">
        {impactAreas.map((area) => (
          <div key={area.name} className="flex items-center gap-2">
            {getImpactIcon(area.impact)}
            <span className="text-sm text-gray-600">{area.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};