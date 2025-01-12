import { Badge } from "@/components/ui/badge";

interface ClassificationBadgeProps {
  classification: string | { _type: string; value: string } | null;
  className?: string;
}

export const ClassificationBadge = ({ classification, className = "" }: ClassificationBadgeProps) => {
  if (!classification) return null;

  // Handle both string and object formats
  const classificationValue = typeof classification === 'string' ? 
    classification : 
    classification.value;

  if (classificationValue === 'undefined') return null;

  return (
    <Badge 
      className={`${className} bg-blue-100 text-blue-800`}
      variant="outline"
    >
      {classificationValue}
    </Badge>
  );
};