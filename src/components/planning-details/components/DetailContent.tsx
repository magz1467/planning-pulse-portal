import { Application } from "@/types/planning";
import { ApplicationTimeline } from "../ApplicationTimeline";
import { ApplicationDescription } from "../ApplicationDescription";
import { ApplicationComments } from "../ApplicationComments";
import { EnvironmentalImpactDial } from "../EnvironmentalImpactDial";
import { ExpectedImpactAreas } from "../ExpectedImpactAreas";

interface DetailContentProps {
  application: Application;
}

export const DetailContent = ({ application }: DetailContentProps) => {
  return (
    <div className="space-y-6">
      <ApplicationTimeline application={application} />
      
      <ApplicationDescription application={application} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnvironmentalImpactDial 
          score={application.impact_score || null}
          details={application.impact_score_details}
          applicationId={application.id}
        />
        <ExpectedImpactAreas 
          application={application}
          impactedServices={application.impacted_services}
        />
      </div>

      <ApplicationComments applicationId={application.id} />
    </div>
  );
};