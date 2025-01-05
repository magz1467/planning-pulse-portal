import { Application } from "@/types/planning";
import { getRandomImage } from "@/utils/imageUtils";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/statusColors";

interface MiniCardProps {
  application: Application;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MiniCard = ({ application, isSelected, onClick }: MiniCardProps) => {
  return (
    <div
      className={`p-3 bg-white border rounded-lg shadow-sm cursor-pointer transition-all ${
        isSelected ? "border-primary" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={application.image_map_url || getRandomImage(application.id)}
            alt="Property"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getRandomImage(application.id);
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Badge
              className="mb-2"
              style={{
                backgroundColor: getStatusColor(application.status),
                color: "white",
              }}
            >
              {application.status}
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {application.description}
          </h3>
          <p className="mt-1 text-sm text-gray-500 truncate">
            {application.site_name || application.site_number} {application.street_name}
          </p>
        </div>
      </div>
    </div>
  );
};