import { Application } from "@/types/planning";
import { cn } from "@/lib/utils";
import { ApplicationTitle } from "./ApplicationTitle";

interface ApplicationHeaderProps {
  application?: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'declined':
        return 'bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/20';
      case 'under review':
        return 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20';
      case 'approved':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div>
      <ApplicationTitle title={application.title || application.description || ''} />
      <p className="text-gray-600 mb-2">{application.address}</p>
      <div className="flex gap-2">
        <span className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          getStatusColor(application.status)
        )}>
          {application.status}
        </span>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-gray-100 text-gray-800 border-gray-200">
          {application.type}
        </span>
      </div>
    </div>
  );
};