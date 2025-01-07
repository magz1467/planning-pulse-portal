import { Application } from "@/types/planning";
import { ApplicationHeader } from "../ApplicationHeader";
import { ApplicationImage } from "../ApplicationImage";
import { ApplicationTimeline } from "../ApplicationTimeline";
import { CollapsibleApplicationDetails } from "../CollapsibleApplicationDetails";
import { ApplicationDescription } from "../ApplicationDescription";
import { ApplicationComments } from "../ApplicationComments";
import { ExpectedImpactAreas } from "../ExpectedImpactAreas";
import { EnvironmentalImpactDial } from "../EnvironmentalImpactDial";
import { ApplicationDocuments } from "../ApplicationDocuments";
import { ApplicationSharing } from "../ApplicationSharing";
import { CreatePetition } from "../CreatePetition";
import { ApplicationFeedback } from "../ApplicationFeedback";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DetailContentProps {
  application: Application;
  feedback: 'up' | 'down' | null;
  handleFeedback: (type: 'up' | 'down') => void;
  feedbackStats: {
    thumbsUp: number;
    thumbsDown: number;
  };
}

export const DetailContent = ({
  application,
  feedback,
  handleFeedback,
  feedbackStats
}: DetailContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <ApplicationHeader application={application} />
      </div>
      
      <ApplicationImage application={application} />
      <ApplicationSharing 
        applicationId={application.id} 
        reference={application.reference}
      />
      <Card className="overflow-hidden">
        <ApplicationTimeline application={application} />
        <Separator className="my-4" />
        <CollapsibleApplicationDetails application={application} />
      </Card>
      
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
        onFeedback={handleFeedback}
        feedbackStats={feedbackStats}
      />

      <ApplicationComments applicationId={application.id} />
      <CreatePetition applicationId={application.id} />
      <ApplicationDocuments />
    </div>
  );
};