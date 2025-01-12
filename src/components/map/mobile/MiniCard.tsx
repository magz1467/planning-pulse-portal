import { Application } from "@/types/planning";
import { Timer } from "lucide-react";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { ImageResolver } from "./components/ImageResolver";
import { StatusBadge } from "./components/StatusBadge";
import { LocationInfo } from "./components/LocationInfo";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ClassificationBadge } from "@/components/applications/ClassificationBadge";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const isClosingSoon = application.last_date_consultation_comments;

  useEffect(() => {
    console.log('MiniCard - Rendering with application:', {
      id: application.id,
      hasImage: !!application.image,
      hasMapUrl: !!application.image_map_url,
      type: application.application_type_full
    });
  }, [application]);

  const getDisplayType = (type: string | undefined) => {
    if (!type) return null;
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('tree')) return 'Tree';
    if (lowerType.includes('householder')) return 'Domestic';
    if (lowerType.includes('full planning permission')) return 'Development';
    return null;
  };

  const displayType = getDisplayType(application.application_type_full);

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-in slide-in-from-bottom duration-300"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
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
          <div className="flex items-start gap-2 flex-wrap">
            <ApplicationTitle 
              title={application.ai_title || application.description || ''} 
              className="line-clamp-2 text-sm font-semibold text-primary"
            />
            {displayType && (
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {displayType}
              </Badge>
            )}
            {isClosingSoon && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Timer className="w-3 h-3 mr-1" />
                Closing soon
              </span>
            )}
          </div>
          <LocationInfo address={application.address} />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={application.status} />
              <ClassificationBadge classification={application.class_3} />
            </div>
            <span className="text-xs text-gray-500">
              {application.distance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};