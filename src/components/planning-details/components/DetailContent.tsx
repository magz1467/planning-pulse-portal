import { Application } from "@/types/planning";
import { ApplicationImage } from "@/components/planning-details/ApplicationImage";
import { ApplicationDescription } from "@/components/planning-details/ApplicationDescription";
import { ApplicationTimeline } from "@/components/planning-details/ApplicationTimeline";
import { ApplicationComments } from "@/components/planning-details/ApplicationComments";
import { ApplicationFeedback } from "@/components/planning-details/ApplicationFeedback";
import { ImpactScoreDetails } from "@/components/planning-details/impact-score/ImpactScoreDetails";

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

      <ImpactScoreDetails application={application} />
      
      <ApplicationComments application={application} />
      
      <ApplicationFeedback application={application} />
    </div>
  );
};