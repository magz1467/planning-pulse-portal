import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { getStatusColor } from "@/utils/statusColors";
import { Timer } from "lucide-react";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface ApplicationHeaderProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  const isClosingSoon = application.last_date_consultation_comments
    ? isWithinNextSevenDays(application.last_date_consultation_comments)
    : false;

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col gap-2">
        <ApplicationTitle
          title={application.ai_title || application.description || ''}
          className="text-xl font-semibold"
        />
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
          {isClosingSoon && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm bg-purple-100 text-purple-800">
              <Timer className="w-4 h-4" />
              Closing soon
            </span>
          )}
        </div>
        <p className="text-gray-600">{application.address}</p>
      </div>
    </Card>
  );
};