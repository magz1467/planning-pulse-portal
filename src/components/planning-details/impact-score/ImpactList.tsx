import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ImpactListProps {
  title: string;
  items?: string[];
}

export const ImpactList: React.FC<ImpactListProps> = ({ title, items }) => {
  if (!items?.length) return null;

  const isRecommendation = title.toLowerCase().includes('recommendation');
  const Icon = isRecommendation ? CheckCircle : AlertTriangle;
  const iconColor = isRecommendation ? 'text-primary' : 'text-yellow-600';

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li 
            key={index}
            className="flex items-start gap-2 text-sm leading-relaxed text-gray-600"
          >
            <span className="text-gray-400 mt-0.5">•</span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
};