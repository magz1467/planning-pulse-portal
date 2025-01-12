import { Badge } from "@/components/ui/badge";
import { Building2, Factory, Leaf, Home } from "lucide-react";

interface ClassificationBadgeProps {
  classification: string | null;
  className?: string;
}

export const ClassificationBadge = ({ classification, className = "" }: ClassificationBadgeProps) => {
  if (!classification) return null;

  const getClassificationDetails = (classification: string) => {
    const normalizedClass = classification.toLowerCase();
    
    switch (normalizedClass) {
      case 'residential':
        return {
          icon: Home,
          color: 'bg-blue-100 text-blue-800'
        };
      case 'commercial':
        return {
          icon: Building2,
          color: 'bg-purple-100 text-purple-800'
        };
      case 'environmental':
        return {
          icon: Leaf,
          color: 'bg-green-100 text-green-800'
        };
      case 'industrial':
        return {
          icon: Factory,
          color: 'bg-orange-100 text-orange-800'
        };
      default:
        return null;
    }
  };

  const details = getClassificationDetails(classification);
  if (!details) return null;

  const Icon = details.icon;

  return (
    <Badge 
      className={`flex items-center gap-1 ${details.color} ${className}`}
      variant="outline"
    >
      <Icon className="w-3 h-3" />
      <span className="capitalize">{classification}</span>
    </Badge>
  );
};