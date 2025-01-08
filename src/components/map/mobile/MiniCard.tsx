import { Application } from "@/types/planning";
import { Timer, X } from "lucide-react";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { ImageResolver } from "./components/ImageResolver";
import { StatusBadge } from "./components/StatusBadge";
import { LocationInfo } from "./components/LocationInfo";
import { Button } from "@/components/ui/button";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
  onClose: () => void;
}

export const MiniCard = ({ application, onClick, onClose }: MiniCardProps) => {
  const isClosingSoon = application.last_date_consultation_comments;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-in slide-in-from-bottom duration-300 relative"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-50"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-4 items-center">
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
          <div className="flex items-center gap-2">
            <ApplicationTitle 
              title={application.ai_title || application.description || ''} 
              className="line-clamp-2 text-sm font-semibold text-primary"
            />
            {isClosingSoon && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Timer className="w-3 h-3 mr-1" />
                Closing soon
              </span>
            )}
          </div>
          <LocationInfo address={application.address} />
          <div className="flex items-center justify-between mt-2">
            <StatusBadge status={application.status} />
            <span className="text-xs text-gray-500">
              {application.distance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};