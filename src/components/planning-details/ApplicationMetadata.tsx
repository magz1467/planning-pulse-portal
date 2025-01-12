import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { ApplicationImage } from "./ApplicationImage";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

export const ApplicationMetadata = ({ application, onShowEmailDialog }: ApplicationMetadataProps) => {
  return (
    <Card className="p-4">
      <div className="w-full mb-4">
        <div className="flex flex-col w-full gap-2">
          <h2 className="text-xl font-semibold break-words">{application.title || application.description}</h2>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Reference: {application.reference}</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 flex-shrink-0"
              onClick={onShowEmailDialog}
            >
              <Bell className="w-4 h-4" />
              Get updates
            </Button>
          </div>
        </div>
      </div>
      
      {application.image && (
        <div className="mb-4">
          <ApplicationImage application={application} />
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        <p className="mb-1">Submitted: {application.submissionDate}</p>
        <p className="mb-1">Decision due: {application.decisionDue}</p>
        <p>Type: {application.type}</p>
      </div>
    </Card>
  );
};