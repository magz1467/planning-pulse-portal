import { Application } from "@/types/planning";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

export const ApplicationMetadata = ({ 
  application,
  onShowEmailDialog
}: ApplicationMetadataProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-semibold">
          {application.engaging_title || application.title || application.reference}
        </h2>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
          <span className="text-sm font-medium">Impact Score:</span>
          <span className="text-sm font-semibold">
            {application.final_impact_score ?? 'Not available'}
          </span>
        </div>
      </div>
    </div>
  );
};