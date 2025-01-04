import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { useState } from "react";
import { FALLBACK_IMAGE } from "@/utils/imageUtils";

interface PlanningApplicationListProps {
  applications: Application[];
  selectedId?: number | null;
  onSelectApplication: (id: number) => void;
}

export const PlanningApplicationList = ({ 
  applications,
  selectedId,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});

  const getImageUrl = (url?: string) => {
    if (!url) return FALLBACK_IMAGE;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${url}`;
  };

  return (
    <div className="space-y-4 p-4">
      {applications.map((application) => {
        const imageUrl = getImageUrl(application.image_map_url || application.image);
        const statusColor = getStatusColor(application.status);
        const statusText = getStatusText(application.status);
        const isClosingSoon = application.consultationEnd && isWithinNextSevenDays(application.consultationEnd);

        return (
          <Card
            key={application.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedId === application.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex gap-3 p-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                {loadingImages[application.id] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={application.description || ''}
                  className={`w-full h-full object-cover ${loadingImages[application.id] ? 'opacity-0' : 'opacity-100'}`}
                  onError={(e) => {
                    console.error('Image load error:', e);
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  onLoadStart={() => setLoadingImages(prev => ({ ...prev, [application.id]: true }))}
                  onLoad={() => setLoadingImages(prev => ({ ...prev, [application.id]: false }))}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <ApplicationTitle title={application.ai_title || application.description} className="text-sm font-medium" />
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {statusText}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{application.address}</span>
                </div>

                {isClosingSoon && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-yellow-600">
                    <Timer className="h-3 w-3" />
                    <span>Consultation closing soon</span>
                  </div>
                )}

                <div className="mt-1 text-xs text-muted-foreground">
                  Reference: {application.reference}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};