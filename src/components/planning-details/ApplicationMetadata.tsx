import { Application } from "@/types/planning";
import { ApplicationHeader } from "./ApplicationHeader";
import { ApplicationImage } from "./ApplicationImage";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

export const ApplicationMetadata = ({ 
  application,
  onShowEmailDialog,
}: ApplicationMetadataProps) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <ApplicationHeader application={application} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowEmailDialog}
          className="text-primary hover:text-primary/80"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
      <ApplicationImage application={application} />
    </>
  );
};