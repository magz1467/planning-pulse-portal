import { Badge } from "@/components/ui/badge";
import { Application } from "@/types/planning";

interface ApplicationHeaderProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{application.title}</h2>
      <p className="text-gray-600 mb-2">{application.address}</p>
      <div className="flex gap-2">
        <Badge>{application.status}</Badge>
        <Badge variant="outline">{application.type}</Badge>
      </div>
    </div>
  );
};