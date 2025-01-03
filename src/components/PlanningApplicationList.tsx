import { Application } from "@/types/planning";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";
import { ApplicationCardImage } from "./applications/cards/ApplicationCardImage";
import { ApplicationCardLocation } from "./applications/cards/ApplicationCardLocation";
import { ApplicationCardStatus } from "./applications/cards/ApplicationCardStatus";
import { ApplicationCardDistance } from "./applications/cards/ApplicationCardDistance";
import { ApplicationCardClosingSoon } from "./applications/cards/ApplicationCardClosingSoon";

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

        return (
          <div
            key={application.id}
            className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex gap-3">
              <ApplicationCardImage 
                imageUrl={application.image_map_url || "/placeholder.svg"}
                alt={application.description || ''}
              />
              
              <div className="flex-1 min-w-0">
                <ApplicationTitle 
                  title={application.ai_title || application.description || ''} 
                  className="mb-1"
                />
                
                <ApplicationCardLocation address={application.address} />
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <ApplicationCardStatus status={application.status} />
                    <ApplicationCardClosingSoon isClosingSoon={isClosingSoon} />
                  </div>
                  <ApplicationCardDistance distance={application.distance} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};