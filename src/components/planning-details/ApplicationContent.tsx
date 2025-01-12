import { Application } from "@/types/planning";
import { ApplicationDescription } from "./ApplicationDescription";
import { ApplicationFeedback } from "./ApplicationFeedback";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { ApplicationComments } from "./ApplicationComments";
import { Card } from "@/components/ui/card";
import { ImpactScoreDetails } from "./impact-score/ImpactScoreDetails";

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
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <ApplicationDescription application={application} />
      </Card>

      <ApplicationFeedback
        feedback={feedback}
        feedbackStats={feedbackStats}
        onFeedback={onFeedback}
      />

      {application.impact_score !== null && application.impact_score_details && (
        <ImpactScoreDetails
          score={application.impact_score}
          details={application.impact_score_details}
          impactedServices={application.impacted_services}
        />
      )}

      <ApplicationTimeline application={application} />
      
      <ApplicationComments applicationId={application.application_id} />
    </div>
  );
};