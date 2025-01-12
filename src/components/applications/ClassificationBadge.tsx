import { Badge } from "@/components/ui/badge";
import { Building2, House, TreeDeciduous, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassificationBadgeProps {
  classification: string | null;
  className?: string;
}

export const ClassificationBadge = ({ classification, className }: ClassificationBadgeProps) => {
  if (!classification) return null;
  
  const classMap: Record<string, { icon: any; label: string; color: string }> = {
    'residential': { 
      icon: House, 
      label: 'Residential',
      color: 'bg-blue-100 text-blue-800'
    },
    'commercial': { 
      icon: Building2, 
      label: 'Commercial',
      color: 'bg-purple-100 text-purple-800'
    },
    'environmental': { 
      icon: TreeDeciduous, 
      label: 'Environmental',
      color: 'bg-green-100 text-green-800'
    },
    'industrial': { 
      icon: Factory, 
      label: 'Industrial',
      color: 'bg-orange-100 text-orange-800'
    }
  };

  const lowerClass = classification.toLowerCase();
  const details = classMap[lowerClass];
  
  if (!details) return null;

  const Icon = details.icon;

  return (
    <Badge 
      className={cn(details.color, "inline-flex items-center gap-1", className)}
      variant="secondary"
    >
      <Icon className="w-3 h-3" />
      {details.label}
    </Badge>
  );
};