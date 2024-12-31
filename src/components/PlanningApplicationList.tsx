import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Bookmark, Heart } from "lucide-react";
import Image from "@/components/ui/image";
import { getStatusColor } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  const getImageUrl = (path: string | undefined) => {
    if (!path || path.trim() === '') {
      return "/lovable-uploads/6bb62e8c-63db-446c-8450-6c39332edb97.png";
    }
    if (path.startsWith('http')) {
      return path;
    }
    return path.startsWith('/') ? path : `/${path}`;
  };

  return (
    <div className="divide-y">
      {applications.map((application) => (
        <div
          key={application.id}
          className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSelectApplication(application.id)}
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={getImageUrl(application.image)}
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
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                <span className="text-xs text-gray-500">{application.distance}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};