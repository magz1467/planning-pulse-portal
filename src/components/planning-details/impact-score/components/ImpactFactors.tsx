import { Check } from "lucide-react";

interface ImpactFactorsProps {
  factors: Record<string, number>;
  title: string;
}

export const ImpactFactors = ({ factors, title }: ImpactFactorsProps) => {
  return (
    <div>
      <h4 className="font-medium mb-2 text-sm">{title}</h4>
      <div className="space-y-1.5">
        {Object.entries(factors).map(([key, value]) => (
          <div 
            key={key}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <Check className="h-4 w-4 text-emerald-500" />
            <span className="capitalize">{key.replace(/_/g, " ")}</span>
            <span className="text-gray-900 font-medium">{value}/5</span>
          </div>
        ))}
      </div>
    </div>
  );
};