import { Application } from "@/types/planning";
import { ApplicationDescription } from "./ApplicationDescription";
import { ApplicationTimeline } from "./ApplicationTimeline"; 
import { CollapsibleApplicationDetails } from "./CollapsibleApplicationDetails";

interface DetailsSectionsProps {
  application: Application;
}

export const DetailsSections = ({ application }: DetailsSectionsProps) => {
  return (
    <>
      <ApplicationDescription application={application} />
      <ApplicationTimeline application={application} />
      <CollapsibleApplicationDetails application={application} />
    </>
  );
};