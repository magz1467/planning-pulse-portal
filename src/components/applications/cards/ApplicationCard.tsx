import { Application } from "@/types/planning";
import { getStatusColor } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";

interface ApplicationCardProps {
  application: Application;
  onSelect?: () => void;
}

export const ApplicationCard = ({ application, onSelect }: ApplicationCardProps) => {
  const imageUrl = application.image_map_url || '/placeholder.svg';

  return (
    <div 
      className="bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onSelect}
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={application.description || 'Planning application'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <ApplicationTitle 
            title={application.ai_title || application.description || ''} 
            className="line-clamp-2 mb-1"
          />
          <p className="text-sm text-gray-600 mt-1 truncate">
            {application.address}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};