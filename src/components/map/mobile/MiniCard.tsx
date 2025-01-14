import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, MessageCircle } from "lucide-react";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";
import { ImageResolver } from "./components/ImageResolver";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const displayTitle = application.engaging_title || application.ai_title || application.description || '';

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
          <h3 className="font-semibold text-primary truncate">
            <ApplicationTitle title={displayTitle} />
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{application.address}</p>
          <div className="flex flex-col gap-2 mt-2">
            <ApplicationBadges
              status={application.status}
              lastDateConsultationComments={application.last_date_consultation_comments}
              class3={application.class_3}
            />
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            // Share functionality
          }}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            // Comment functionality
          }}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>
    </div>
  );
};
