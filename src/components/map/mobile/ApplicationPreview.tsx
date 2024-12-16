import { Application } from "@/types/planning";

interface ApplicationPreviewProps {
  application: Application;
  onClick: () => void;
}

export const ApplicationPreview = ({ application, onClick }: ApplicationPreviewProps) => (
  <div 
    className="p-4 cursor-pointer"
    onClick={onClick}
  >
    <h3 className="font-semibold text-primary">{application.title}</h3>
    <p className="text-sm text-gray-600 mt-1">{application.address}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
        {application.status}
      </span>
      <span className="text-xs text-gray-500">{application.distance}</span>
    </div>
  </div>
);