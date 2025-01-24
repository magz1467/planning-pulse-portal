import { Application } from "@/types/planning";
import { MapPin } from "lucide-react";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";
import { ImageResolver } from "@/components/map/mobile/components/ImageResolver";
import { FeedbackButtons } from "./FeedbackButtons";
import { cn } from "@/lib/utils";

interface ApplicationListItemProps {
  application: Application;
  onSelect: (id: number) => void;
  onFeedback?: (applicationId: number, type: 'yimby' | 'nimby') => void;
  className?: string;
}

export const ApplicationListItem = ({ 
  application,
  onSelect,
  onFeedback,
  className
}: ApplicationListItemProps) => {
  const handleFeedback = (applicationId: number, type: 'yimby' | 'nimby') => {
    if (onFeedback) {
      onFeedback(applicationId, type);
    }
  };

  return (
    <div
      key={application.id}
      className={cn(
        "py-4 px-4 cursor-pointer hover:bg-gray-50 transition-colors",
        className
      )}
      onClick={() => onSelect(application.id)}
    >
      <div className="flex gap-3">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageResolver
            imageMapUrl={application.image_map_url}
            image={application.image}
            title={application.title || application.description || ''}
            applicationId={application.id}
            coordinates={application.coordinates}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ApplicationTitle 
            title={application.engaging_title || application.description || ''} 
            className="mb-1 text-base"
          />
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <p className="text-sm truncate">{application.address}</p>
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <ApplicationBadges
              status={application.status}
              lastDateConsultationComments={application.last_date_consultation_comments}
              impactScore={application.final_impact_score}
              validDate={application.valid_date}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">{application.distance}</span>
              {application.feedback_stats && (
                <FeedbackButtons
                  applicationId={application.id}
                  feedbackStats={application.feedback_stats}
                  onFeedback={handleFeedback}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};