import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import Image from "@/components/ui/image";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  activeSort?: SortType;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
  activeSort
}: PlanningApplicationListProps) => {
  const sortedApplications = useSortApplications(applications, activeSort);

  return (
    <div className="divide-y">
      {sortedApplications.map((application) => {
        const isClosingSoon = application.last_date_consultation_comments ? 
          isWithinNextSevenDays(application.last_date_consultation_comments) : false;

        // Fallback chain: image_map_url -> image -> placeholder
        const imageUrl = application.image_map_url || application.image || "/placeholder.svg";
        console.log('Application image details:', {
          id: application.id,
          image_map_url: application.image_map_url,
          image: application.image,
          final_url: imageUrl
        });

        return (
          <div
            key={application.id}
            className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={imageUrl}
                  alt={application.description || ''}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image load error for application:', application.id, e);
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <ApplicationTitle 
                  title={application.ai_title || application.description || ''} 
                  className="mb-1 line-clamp-3 text-primary"
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
          </div>
        );
      })}
    </div>
  );
}