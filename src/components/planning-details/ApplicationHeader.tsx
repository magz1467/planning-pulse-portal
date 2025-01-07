import { Application } from "@/types/planning";
import { Timer } from "lucide-react";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface ApplicationHeaderProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  const isClosingSoon = isWithinNextSevenDays(application.last_date_consultation_comments);

  return (
    <div>
      <h2 className="text-xl font-semibold line-clamp-2 leading-tight">
        {application.title || application.description}
      </h2>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-gray-600">{application.reference}</p>
        {isClosingSoon && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Timer className="w-3 h-3 mr-1" />
            Closing soon
          </span>
        )}
      </div>
    </div>
  );
};