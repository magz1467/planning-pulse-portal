import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import Image from "@/components/ui/image";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useSortApplications, SortType } from "@/hooks/use-sort-applications";
import { getImageUrl, FALLBACK_IMAGE } from "@/utils/imageUtils";
import { useState } from "react";
import { testEdgeFunction } from "@/utils/debugUtils";
import { Button } from "./ui/button";

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
  const [loadingImages, setLoadingImages] = useState<{[key: number]: boolean}>({});

  const handleTestClick = async () => {
    console.log('Testing edge function connection...');
    await testEdgeFunction();
  };

  return (
    <div className="divide-y">
      <div className="p-4">
        <Button onClick={handleTestClick} variant="outline" size="sm">
          Test Edge Function
        </Button>
      </div>
      {sortedApplications.map((application) => {
        const isClosingSoon = application.last_date_consultation_comments ? 
          isWithinNextSevenDays(application.last_date_consultation_comments) : false;

        // Use image_map_url if available, otherwise try to get image from storage
        const imageUrl = getImageUrl(application.image_map_url || application.image);
        console.log('Application image data:', {
          id: application.id,
          image_map_url: application.image_map_url,
          image: application.image,
          resolved_url: imageUrl
        });

        return (
          <div
            key={application.id}
            className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {loadingImages[application.id] && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}
                <Image
                  src={imageUrl}
                  alt={application.description || ''}
                  width={80}
                  height={80}
                  className={`w-full h-full object-cover ${loadingImages[application.id] ? 'hidden' : ''}`}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  onLoadStart={() => setLoadingImages(prev => ({ ...prev, [application.id]: true }))}
                  onLoad={() => setLoadingImages(prev => ({ ...prev, [application.id]: false }))}
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