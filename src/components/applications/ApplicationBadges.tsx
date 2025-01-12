import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface ApplicationBadgesProps {
  status: string;
  lastDateConsultationComments?: string | null;
  class3?: string | null;
}

export const ApplicationBadges = ({
  status,
  lastDateConsultationComments,
  class3
}: ApplicationBadgesProps) => {
  const badges = [];

  // Status badge
  badges.push(
    <span key="status" className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );

  // Closing soon badge
  if (lastDateConsultationComments && isWithinNextSevenDays(lastDateConsultationComments)) {
    badges.push(
      <span key="closing" className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
        <Timer className="w-3 h-3" />
        Closing soon
      </span>
    );
  }

  // Classification badge
  if (class3 && class3 !== 'undefined') {
    badges.push(
      <Badge key="classification" variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
        {class3}
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges}
    </div>
  );
};