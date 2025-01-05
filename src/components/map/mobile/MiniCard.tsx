import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  console.log("MiniCard render", { applicationId: application.id });
  
  const isClosingSoon = application.last_date_consultation_comments ? 
    isWithinNextSevenDays(application.last_date_consultation_comments) : false;

  return (
    <Card
      className="fixed bottom-0 left-0 right-0 z-[2000] bg-white rounded-t-xl shadow-lg p-4 cursor-pointer"
      onClick={() => {
        console.log("MiniCard clicked");
        onClick();
      }}
    >
      <div className="flex gap-3">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={application.image_map_url || '/placeholder.svg'}
            alt={application.description}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("Image load error, using placeholder");
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ApplicationTitle 
            title={application.ai_title || application.description || ''} 
            className="mb-1"
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
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                  <Timer className="w-3 h-3" />
                  Closing soon
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};