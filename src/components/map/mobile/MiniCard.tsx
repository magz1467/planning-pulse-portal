import { Application } from "@/types/planning";
import { ApplicationImage } from "./ApplicationImage";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 cursor-pointer"
      onClick={onClick}
      style={{ zIndex: 1000 }}
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <ApplicationImage src={application.image} alt={application.title} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary line-clamp-1">{application.title}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded inline-block mt-1">
            {application.status}
          </span>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{application.address}</p>
        </div>
      </div>
    </div>
  );
};