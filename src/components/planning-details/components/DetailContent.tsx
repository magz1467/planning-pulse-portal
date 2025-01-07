import { Application } from "@/types/planning";
import { ApplicationImage } from "@/components/planning-details/ApplicationImage";
import { ApplicationDescription } from "@/components/planning-details/ApplicationDescription";
import { ApplicationTimeline } from "@/components/planning-details/ApplicationTimeline";
import { ApplicationComments } from "@/components/planning-details/ApplicationComments";
import { ApplicationFeedback } from "@/components/planning-details/ApplicationFeedback";
import { EnvironmentalImpactDial } from "@/components/planning-details/EnvironmentalImpactDial";

interface DetailContentProps {
  application: Application;
}

export const DetailContent = ({
  application,
}: DetailContentProps) => {
  return (
    <div className="space-y-6">
      <ApplicationImage application={application} />
      
      <ApplicationDescription application={application} />
      
      <ApplicationTimeline application={application} />

      <EnvironmentalImpactDial 
        score={application.impact_score || null}
        details={application.impact_score_details}
        applicationId={application.application_id}
      />
      
      <ApplicationComments applicationId={application.application_id} />
      
      <ApplicationFeedback 
        applicationId={application.application_id}
        feedback={null}
        onFeedback={() => {}}
      />
    </div>
  );
};