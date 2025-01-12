import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";
import { ImageResolver } from "@/components/map/mobile/components/ImageResolver";
import { ClassificationBadge } from "@/components/applications/ClassificationBadge";

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

  console.log('PlanningApplicationList - Rendering applications:', applications.length);

  return (
    <div className="divide-y">
      {sortedApplications.map((application) => {
        const isClosingSoon = application.last_date_consultation_comments ? 
          isWithinNextSevenDays(application.last_date_consultation_comments) : false;

        console.log('Application class_3:', application.class_3);

        return (
          <div
            key={application.id}
            className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex gap-3">
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
                <ApplicationTitle 
                  title={application.ai_title || application.description || ''} 
                  className="mb-1"
                />
                <div className="flex items-center gap-1 mt-1 text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <p className="text-sm truncate">{application.address}</p>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                    {isClosingSoon && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                        <Timer className="w-3 h-3" />
                        Closing soon
                      </span>
                    )}
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
      })}
    </div>
  );
}