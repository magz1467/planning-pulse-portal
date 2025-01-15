import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { useApplicationSorting, SortType } from "@/hooks/use-sort-applications";
import { ImageResolver } from "@/components/map/mobile/components/ImageResolver";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  activeSort?: SortType;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
  activeSort,
  postcode
}: PlanningApplicationListProps) => {
  const sortedApplications = useApplicationSorting({
    type: activeSort || null,
    applications
  });

  console.log('PlanningApplicationList - Rendering with applications:', applications?.length);

  if (!applications?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500 mb-2">No planning applications found</p>
        <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {sortedApplications.map((application) => (
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
                title={application.engaging_title || application.description || ''} 
                className="mb-1"
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
                />
                <span className="text-xs text-gray-500">{application.distance}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}