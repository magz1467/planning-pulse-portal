import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { cn } from "@/lib/utils";

interface ProjectSummaryProps {
  application: Application;
}

export const ProjectSummary = ({ application }: ProjectSummaryProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {application.ai_title || application.description}
          </h2>
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{application.address}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn("text-sm px-2 py-1 rounded", getStatusColor(application.status))}>
            {getStatusText(application.status)}
          </span>
          {application.distance && (
            <span className="text-sm text-gray-500">{application.distance}</span>
          )}
        </div>
      </div>
    </Card>
  );
};