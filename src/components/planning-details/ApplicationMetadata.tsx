import { Application } from "@/types/planning";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

export const ApplicationMetadata = ({ application, onShowEmailDialog }: ApplicationMetadataProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{application.title || application.description}</h1>
      <p className="text-gray-600">{application.address}</p>
      <div className="flex gap-2">
        <span className="text-sm bg-primary-light text-primary px-2 py-1 rounded">
          {application.status}
        </span>
        <button
          onClick={onShowEmailDialog}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Get Updates
        </button>
      </div>
    </div>
  );
};