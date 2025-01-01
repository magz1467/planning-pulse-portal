import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import Image from "@/components/ui/image";
import { getStatusColor } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
  activeSort?: 'closingSoon' | 'newest' | null;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
  activeSort
}: PlanningApplicationListProps) => {
  console.log("PlanningApplicationList applications:", applications);
  console.log("PlanningApplicationList activeSort:", activeSort);

  // Sort applications based on activeSort
  const sortedApplications = [...applications].sort((a, b) => {
    if (activeSort === 'newest') {
      const dateA = a.valid_date ? new Date(a.valid_date) : new Date(0);
      const dateB = b.valid_date ? new Date(b.valid_date) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    } else if (activeSort === 'closingSoon') {
      const dateA = a.last_date_consultation_comments ? new Date(a.last_date_consultation_comments) : new Date(0);
      const dateB = b.last_date_consultation_comments ? new Date(b.last_date_consultation_comments) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    }
    return 0;
  });

  console.log("PlanningApplicationList sortedApplications:", sortedApplications);

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
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={application.image}
                  alt={application.description || ''}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
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
                      {application.status}
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
};