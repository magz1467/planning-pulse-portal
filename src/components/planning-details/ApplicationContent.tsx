import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { CollapsibleApplicationDetails } from "./CollapsibleApplicationDetails";
import { ExpectedImpactAreas } from "./ExpectedImpactAreas";
import { ApplicationComments } from "./ApplicationComments";
import { Separator } from "@/components/ui/separator";

interface ApplicationContentProps {
  application: Application;
  onClose?: () => void;
}

export const ApplicationContent = ({ application, onClose }: ApplicationContentProps) => {
  return (
    <>
      <Card className="overflow-hidden">
        <ApplicationTimeline application={application} />
        <Separator className="my-4" />
        <CollapsibleApplicationDetails application={application} />
      </Card>
      <ExpectedImpactAreas application={application} />
      <ApplicationComments application={application} onClose={onClose} />
    </>
  );
};