import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";
import { cn } from "@/lib/utils";

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

  // Array of diverse house images from Unsplash
  const houseImages = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60", // Modern house
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60", // Traditional house
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop&q=60", // Suburban house
    "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60", // Luxury house
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"  // Contemporary house
  ];

  // Function to get a random image based on application id
  const getRandomImage = (id: number) => {
    // Use the application id to consistently get the same image for the same application
    return houseImages[id % houseImages.length];
  };

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
                <img
                  src={getRandomImage(application.id)}
                  alt="Property image"
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