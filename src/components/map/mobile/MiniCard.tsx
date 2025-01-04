import { Application } from "@/types/planning";
import { MapPin } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import Image from "@/components/ui/image";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const statusColor = getStatusColor(application.status);
  const statusText = getStatusText(application.status);

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-slide-up"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
      <div className="flex gap-4 items-start">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={application.image_map_url || application.image || "/placeholder.svg"}
            alt={application.description || ''}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <ApplicationTitle 
              title={application.ai_title || application.description || ''} 
              className="text-sm font-medium line-clamp-2"
            />
            <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}>
              {statusText}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <p className="truncate">{application.address}</p>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Reference: {application.reference}
          </div>
        </div>
      </div>
    </div>
  );
};