import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationImage } from "./planning-details/ApplicationImage";
import { ApplicationDetails } from "./planning-details/ApplicationDetails";
import { ApplicationDescription } from "./planning-details/ApplicationDescription";
import { ApplicationComments } from "./planning-details/ApplicationComments";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface PlanningApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  // Mock data for feedback counts - in a real application, this would come from your backend
  const feedbackStats = {
    thumbsUp: 12,
    thumbsDown: 3
  };

  return (
    <div className="relative">
      <div className="flex justify-end p-2 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-6 space-y-4">
        <ApplicationHeader application={application} />
        <ApplicationImage application={application} />
        <ApplicationDetails application={application} />
        <ApplicationDescription application={application} />
        
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Community Feedback</h3>
          <div className="flex gap-8">
            <div className="flex items-center gap-2 flex-wrap">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium">{feedbackStats.thumbsUp}</span>
              <span className="text-gray-500 text-sm">people like this</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <ThumbsDown className="h-5 w-5 text-[#ea384c]" />
              <span className="text-lg font-medium">{feedbackStats.thumbsDown}</span>
              <span className="text-gray-500 text-sm">people dislike this</span>
            </div>
          </div>
        </Card>

        <ApplicationComments />
      </div>
    </div>
  );
};