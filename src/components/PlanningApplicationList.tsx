import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Bookmark, Heart } from "lucide-react";
import Image from "@/components/ui/image";
import { getStatusColor } from "@/utils/statusColors";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  const getImageUrl = (path: string) => {
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
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {application.image ? (
                  <Image
                    src={getImageUrl(application.image)}
                    alt={application.description || ''}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary line-clamp-2">
                  {application.ai_title || application.description || ''}
                </h3>
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
            
            <div className="flex justify-end gap-3 pt-2 border-t">
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};