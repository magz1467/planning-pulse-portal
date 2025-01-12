import { Application } from "@/types/planning";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { CollapsibleApplicationDetails } from "./CollapsibleApplicationDetails";
import { ApplicationDescription } from "./ApplicationDescription";
import { ApplicationComments } from "./ApplicationComments";
import { ExpectedImpactAreas } from "./ExpectedImpactAreas";
import { EnvironmentalImpactDial } from "./EnvironmentalImpactDial";
import { ApplicationDocuments } from "./ApplicationDocuments";
import { CreatePetition } from "./CreatePetition";
import { ApplicationFeedback } from "./ApplicationFeedback";
import { ProjectedCost } from "./ProjectedCost";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ApplicationContentProps {
  application: Application;
  feedback: 'up' | 'down' | null;
  feedbackStats: {
    thumbsUp: number;
    thumbsDown: number;
  };
  onFeedback: (type: 'up' | 'down') => void;
}

export const ApplicationContent = ({
  application,
  feedback,
  feedbackStats,
  onFeedback,
}: ApplicationContentProps) => {
  const projectedCost = application.application_details?.projected_cost_of_works;

  return (
    <>
      <Card className="overflow-hidden">
        <ApplicationTimeline application={application} />
        <Separator className="my-4" />
        <CollapsibleApplicationDetails application={application} />
      </Card>
      
      {projectedCost && (
        <ProjectedCost cost={projectedCost} />
      )}

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

      <ApplicationDescription application={application} />
      
      <ApplicationFeedback 
        feedback={feedback}
        onFeedback={onFeedback}
        feedbackStats={feedbackStats}
      />

      <ApplicationComments applicationId={application.id} />
      <CreatePetition applicationId={application.id} />
      <ApplicationDocuments />
    </>
  );
};