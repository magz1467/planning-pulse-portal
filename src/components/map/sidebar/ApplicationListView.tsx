import { Application } from "@/types/planning";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statusColors } from "@/utils/statusColors";

interface ApplicationListViewProps {
  applications: Application[];
  selectedApplication: number | null;
  postcode: string;
  onSelectApplication: (id: number) => void;
}

export const ApplicationListView = ({
  applications,
  selectedApplication,
  postcode,
  onSelectApplication,
}: ApplicationListViewProps) => {
  if (!applications.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center text-gray-500">
        No planning applications found near {postcode}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedApplication === application.id
                ? "border-primary bg-primary/5"
                : "hover:border-gray-400"
            }`}
            onClick={() => onSelectApplication(application.id)}
          >
            <div className="flex-1 min-w-0">
              <ApplicationTitle 
                title={application.ai_title || application.description || ''} 
                className="mb-1 line-clamp-3 text-primary"
              />
              <div className="flex items-center gap-1 mt-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                <span className="text-sm truncate">{application.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="outline" 
                  className={`${statusColors[application.status] || statusColors.default}`}
                >
                  {application.status}
                </Badge>
                {application.distance && (
                  <Badge variant="secondary">{application.distance}</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};