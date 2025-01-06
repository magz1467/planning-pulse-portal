import { getStatusColor, getStatusText } from "@/utils/statusColors";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};