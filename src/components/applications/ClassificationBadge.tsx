import { Badge } from "@/components/ui/badge";

interface ClassificationBadgeProps {
  classification: string | { _type: string; value: string } | null;
  className?: string;
}

export const ClassificationBadge = ({ classification, className = "" }: ClassificationBadgeProps) => {
  // Add more detailed logging
  console.log('ClassificationBadge - Raw input:', classification);

  if (!classification) {
    console.log('ClassificationBadge - No classification provided');
    return null;
  }

  // Handle both string and object formats
  const classificationValue = typeof classification === 'string' ? 
    classification : 
    classification.value;

  console.log('ClassificationBadge - Processed value:', classificationValue);

  // Only return null if the actual value is undefined or "undefined"
  if (!classificationValue || classificationValue === 'undefined') {
    console.log('ClassificationBadge - Invalid value, not rendering');
    return null;
  }

  return (
    <div className="inline-flex items-center bg-blue-50 px-2.5 py-0.5 rounded-md">
      <span className="text-xs font-medium text-blue-700">
        {classificationValue}
      </span>
    </div>
  );
};