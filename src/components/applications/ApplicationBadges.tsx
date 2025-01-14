import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface ApplicationBadgesProps {
  status: string;
  lastDateConsultationComments?: string | null;
  impactScore?: number | null;
}

export const ApplicationBadges = ({
  status,
  lastDateConsultationComments,
  impactScore
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

  // Impact score badge
  if (impactScore !== null && impactScore !== undefined) {
    let impactColor = "bg-green-100 text-green-800";
    let impactText = "Low Impact";
    
    if (impactScore >= 70) {
      impactColor = "bg-red-100 text-red-800";
      impactText = "High Impact";
    } else if (impactScore >= 30) {
      impactColor = "bg-orange-100 text-orange-800";
      impactText = "Medium Impact";
    }

    badges.push(
      <Badge key="impact" variant="secondary" className={`text-xs ${impactColor}`}>
        {impactText} ({impactScore})
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges}
    </div>
  );
};