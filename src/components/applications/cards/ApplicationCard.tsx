import { Application } from "@/types/planning";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { ApplicationCardImage } from "./ApplicationCardImage";
import { ApplicationCardLocation } from "./ApplicationCardLocation";
import { ApplicationCardStatus } from "./ApplicationCardStatus";
import { ApplicationCardDistance } from "./ApplicationCardDistance";
import { ApplicationCardClosingSoon } from "./ApplicationCardClosingSoon";

interface ApplicationCardProps {
  application: Application;
  onSelect: () => void;
}

export const ApplicationCard = ({ application, onSelect }: ApplicationCardProps) => {
  const isClosingSoon = application.last_date_consultation_comments ? 
    isWithinNextSevenDays(application.last_date_consultation_comments) : false;

  // Get image URL from application details if available
  const imageUrl = application.application_details?.images?.[0] || application.image_map_url || null;

  return (
    <div
      className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onSelect}
    >
      <div className="flex gap-3">
        <ApplicationCardImage 
          imageUrl={imageUrl || "/placeholder.svg"}
          alt={application.description || ''}
        />
        
        <div className="flex-1 min-w-0">
          <ApplicationTitle 
            title={application.ai_title || application.description || ''} 
            className="mb-1"
          />
          
          <ApplicationCardLocation address={application.address} />
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <ApplicationCardStatus status={application.status} />
              <ApplicationCardClosingSoon isClosingSoon={isClosingSoon} />
            </div>
            <ApplicationCardDistance distance={application.distance} />
          </div>
        </div>
      </div>
    </div>
  );
};