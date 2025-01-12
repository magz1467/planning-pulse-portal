import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";
import { ImageResolver } from "@/components/map/mobile/components/ImageResolver";
import { Badge } from "@/components/ui/badge";

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

  const renderBadges = (application: Application) => {
    const badges = [];

    // Status badge
    badges.push(
      <span key="status" className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
        {getStatusText(application.status)}
      </span>
    );

    // Closing soon badge
    if (application.last_date_consultation_comments && 
        isWithinNextSevenDays(application.last_date_consultation_comments)) {
      badges.push(
        <span key="closing" className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
          <Timer className="w-3 h-3" />
          Closing soon
        </span>
      );
    }

    // Classification badge
    if (application.class_3 && application.class_3 !== 'undefined') {
      badges.push(
        <Badge key="classification" variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
          {application.class_3}
        </Badge>
      );
    }

    return badges;
  };

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
                title={application.ai_title || application.description || ''} 
                className="mb-1"
              />
              <div className="flex items-center gap-1 mt-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                <p className="text-sm truncate">{application.address}</p>
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  {renderBadges(application)}
                </div>
                <span className="text-xs text-gray-500">{application.distance}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}