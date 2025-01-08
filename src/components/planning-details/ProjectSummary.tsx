import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";
import { ApplicationDescription } from "./ApplicationDescription";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { ApplicationDocuments } from "./ApplicationDocuments";
import { ApplicationSharing } from "./ApplicationSharing";
import { ImpactScoreDetails } from "./impact-score/ImpactScoreDetails";
import { DetailsActions } from "./DetailsActions";

interface ProjectSummaryProps {
  application: Application;
}

export const ProjectSummary = ({ application }: ProjectSummaryProps) => {
  if (!application) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <ApplicationDescription application={application} />
          <ApplicationTimeline application={application} />
          <ApplicationDocuments application={application} />
          <DetailsActions application={application} />
          <ApplicationSharing application={application} />
          <ImpactScoreDetails application={application} />
        </div>
      </Card>
    </div>
  );
};