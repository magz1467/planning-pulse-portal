import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ApplicationDetails } from "@/components/applications/dashboard/components/ApplicationDetails";

interface ApplicationDetailViewProps {
  application: Application;
  onClose: () => void;
}

export const ApplicationDetailView = ({
  application,
  onClose,
}: ApplicationDetailViewProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Planning Application Details</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ApplicationDetails application={application} onClose={onClose} />
      </div>
    </div>
  );
};