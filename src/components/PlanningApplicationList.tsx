import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer, X } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";
import { cn } from "@/lib/utils";
import { ImageResolver } from "@/components/map/mobile/components/ImageResolver";
import { ProjectSummary } from "@/components/planning-details/ProjectSummary";

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

        console.log('Application details for ID:', application.id, {
          hasDetails: !!application.application_details,
          detailsLength: application.application_details ? Object.keys(application.application_details).length : 0,
          details: application.application_details
        });

        return (
          <div
            key={application.id}
            className="relative py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectApplication(null);
              }}
              className="absolute top-2 right-2 z-10 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
            
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
                {application.application_details && Object.keys(application.application_details).length > 0 && (
                  <div className="mt-3">
                    <ProjectSummary applicationDetails={application.application_details} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}