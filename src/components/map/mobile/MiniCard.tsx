import { Application } from "@/types/planning";
import { StatusBadge } from "./components/StatusBadge";
import { ImageResolver } from "./components/ImageResolver";
import { ClassificationBadge } from "@/components/applications/ClassificationBadge";

interface MiniCardProps {
  application: Application;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MiniCard = ({ application, isSelected, onClick }: MiniCardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageResolver
            imageMapUrl={application.image_map_url}
            image={application.image}
            title={application.title || application.description || ''}
            applicationId={application.id}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate">
            {application.ai_title || application.description}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{application.address}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2">
              <StatusBadge status={application.status} />
              {application.class_3 && (
                <ClassificationBadge classification={application.class_3} />
              )}
            </div>
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
};