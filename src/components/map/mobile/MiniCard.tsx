import { Application } from "@/types/planning";
import { MapPin } from "lucide-react";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'declined':
        return 'bg-[#ea384c]/10 text-[#ea384c]';
      case 'under review':
        return 'bg-[#F97316]/10 text-[#F97316]';
      case 'approved':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-in slide-in-from-bottom duration-300"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
      <div className="flex gap-4 items-center">
        {application.image && (
          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={application.image}
              alt={application.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate">{application.title}</h3>
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <p className="text-sm truncate">{application.address}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
            <span className="text-xs text-gray-500">
              {application.distance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};