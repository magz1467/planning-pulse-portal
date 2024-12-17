import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "@/components/ui/image";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number) => void;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'declined':
        return 'bg-[#ea384c]/10 text-[#ea384c]';
      case 'under review':
        return 'bg-[#F97316]/10 text-[#F97316]';
      case 'approved':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getImageUrl = (path: string) => {
    // If the path already starts with http or https, return it as is
    if (path.startsWith('http')) {
      return path;
    }
    // Otherwise, ensure it starts with a forward slash and return the full path
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
              {application.image ? (
                <Image
                  src={getImageUrl(application.image)}
                  alt={application.title}
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
              <h3 className="font-semibold text-primary truncate">{application.title}</h3>
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
