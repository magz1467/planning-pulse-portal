import { getStatusColor, getStatusText } from "@/utils/statusColors";

interface ApplicationCardStatusProps {
  status: string;
}

export const ApplicationCardStatus = ({ status }: ApplicationCardStatusProps) => {
  return (
    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};