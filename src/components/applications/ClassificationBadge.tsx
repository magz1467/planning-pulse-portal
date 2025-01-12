import { Badge } from "@/components/ui/badge";

interface ClassificationBadgeProps {
  classification: string | { _type: string; value: string } | null;
  className?: string;
}

export const ClassificationBadge = ({ classification }: ClassificationBadgeProps) => {
  // If no classification provided, don't render anything
  if (!classification) {
    console.log('ClassificationBadge: No classification provided');
    return null;
  }

  // Get the display value
  const displayValue = typeof classification === 'string' 
    ? classification 
    : classification.value;

  // Only render if we have a valid display value
  if (!displayValue || displayValue === 'undefined') {
    console.log('ClassificationBadge: Invalid display value:', displayValue);
    return null;
  }

  return (
    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
      {displayValue}
    </Badge>
  );
};