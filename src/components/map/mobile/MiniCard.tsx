import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";
import { ImageResolver } from "./components/ImageResolver";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-[1000]">
      <div className="flex gap-3" onClick={onClick}>
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageResolver
            imageMapUrl={application.image_map_url}
            image={application.image}
            title={application.title || application.description || ''}
            applicationId={application.id}
            coordinates={application.coordinates}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary mb-1 line-clamp-2">
            <ApplicationTitle title={application.engaging_title || application.description || ''} />
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{application.address}</p>
          <div className="flex items-center gap-2">
            <ApplicationBadges
              status={application.status}
              lastDateConsultationComments={application.last_date_consultation_comments}
              impactScore={application.final_impact_score}
            />
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};