import { Application } from "@/types/planning";
import { MapPin, Timer } from "lucide-react";
import Image from "@/components/ui/image";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { getStatusColor, getStatusText } from "@/utils/statusColors";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const isClosingSoon = isWithinNextSevenDays(application.last_date_consultation_comments);
  
  // Fallback chain: image_map_url -> image -> placeholder
  const imageUrl = application.image_map_url || application.image || "/placeholder.svg";
  console.log('MiniCard image URL:', imageUrl, 'for application:', application.id);

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-in slide-in-from-bottom duration-300"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <Image
            src={imageUrl}
            alt={application.description || ''}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image load error in MiniCard for application:', application.id, e);
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ApplicationTitle 
            title={application.ai_title || application.description || ''} 
            className="line-clamp-2 mb-1"
          />
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <p className="text-sm truncate">{application.address}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
              {isClosingSoon && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Timer className="w-3 h-3 mr-1" />
                  Closing soon
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};