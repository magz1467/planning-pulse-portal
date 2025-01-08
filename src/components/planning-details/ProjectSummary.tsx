import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProjectSummaryProps {
  applicationDetails: Record<string, any> | null;
}

export const ProjectSummary = ({ applicationDetails }: ProjectSummaryProps) => {
  if (!applicationDetails) return null;

  // Convert the details into a more readable format
  const summaryItems = Object.entries(applicationDetails)
    .filter(([key, value]) => value !== null && value !== undefined)
    .map(([key, value]) => ({
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: typeof value === 'boolean' ? value : String(value)
    }));

  if (summaryItems.length === 0) return null;

  return (
    <Card className="p-4 mt-4">
      <h3 className="font-semibold text-lg mb-3">Project Summary</h3>
      <div className="space-y-2">
        {summaryItems.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            {typeof value === 'boolean' ? (
              value ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )
            ) : null}
            <span className="text-gray-600">{label}:</span>
            <span className="font-medium">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};