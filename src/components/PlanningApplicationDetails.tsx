import { Application } from "@/types/planning";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationImage } from "./planning-details/ApplicationImage";
import { DetailsSections } from "./planning-details/DetailsSections";
import { DetailsActions } from "./planning-details/DetailsActions";
import { ProjectSummary } from "./applications/ProjectSummary";
import { useEffect } from "react";

interface PlanningApplicationDetailsProps {
  application?: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!application) return null;

  return (
    <div className="p-6 space-y-4 pb-20">
      <div className="flex justify-between items-start">
        <ApplicationHeader application={application} />
      </div>
      
      <ApplicationImage application={application} />
      
      <ProjectSummary applicationDetails={application.application_details} />
      
      <DetailsSections application={application} />
      
      <DetailsActions application={application} />
    </div>
  );
};