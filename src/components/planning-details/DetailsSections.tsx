import { Application } from "@/types/planning";
import { ApplicationDescription } from "./ApplicationDescription";
import { ApplicationComments } from "./ApplicationComments";
import { ExpectedImpactAreas } from "./ExpectedImpactAreas";
import { EnvironmentalImpactDial } from "./EnvironmentalImpactDial";
import { ApplicationDocuments } from "./ApplicationDocuments";
import { ApplicationSharing } from "./ApplicationSharing";
import { CreatePetition } from "./CreatePetition";
import { ApplicationFeedback } from "./ApplicationFeedback";
import { ProjectSummary } from "./ProjectSummary";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DetailsSectionsProps {
  application: Application;
}

export const DetailsSections = ({ application }: DetailsSectionsProps) => {
  return (
    <>
      <ApplicationSharing 
        applicationId={application.id} 
        reference={application.reference}
      />
      <Card className="overflow-hidden">
        <ApplicationTimeline application={application} />
        <Separator className="my-4" />
        <CollapsibleApplicationDetails application={application} />
      </Card>
      
      <ProjectSummary applicationDetails={application.application_details} />
      <ApplicationDescription application={application} />
      
      <EnvironmentalImpactDial 
        score={application.impact_score} 
        details={application.impact_score_details}
        applicationId={application.id}
      />

      {application.impact_score_details?.impacted_services && (
        <ExpectedImpactAreas 
          application={application}
          impactedServices={application.impact_score_details.impacted_services}
        />
      )}

      <ApplicationComments applicationId={application.id} />
      <CreatePetition applicationId={application.id} />
      <ApplicationDocuments />
    </>
  );
};