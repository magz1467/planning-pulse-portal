import { Application } from "@/types/planning";
import { ApplicationDescription } from "./ApplicationDescription";
import { ProjectSummary } from "./ProjectSummary";
import { ApplicationTimeline } from "./ApplicationTimeline"; 
import { CollapsibleApplicationDetails } from "./CollapsibleApplicationDetails";

interface DetailsSectionsProps {
  application: Application;
}

export const DetailsSections = ({ application }: DetailsSectionsProps) => {
  return (
    <>
      <ProjectSummary applicationDetails={application.application_details} />
      <ApplicationDescription application={application} />
      <ApplicationTimeline application={application} />
      <CollapsibleApplicationDetails application={application} />
    </>
  );
};