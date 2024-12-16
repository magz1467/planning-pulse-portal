import { Application } from "@/types/planning";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationImage } from "./planning-details/ApplicationImage";
import { ApplicationDetails } from "./planning-details/ApplicationDetails";
import { ApplicationDescription } from "./planning-details/ApplicationDescription";
import { ApplicationComments } from "./planning-details/ApplicationComments";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmailDialog } from "./EmailDialog";

interface PlanningApplicationDetailsProps {
  application?: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();
  
  if (!application) return null;

  // Mock data for feedback counts - in a real application, this would come from your backend
  const feedbackStats = {
    thumbsUp: 12,
    thumbsDown: 3
  };

  const handleEmailSubmit = (email: string) => {
    toast({
      title: "Notification setup",
      description: `We'll email you at ${email} when a decision is made on this application.`,
      duration: 5000,
    });
  };

  return (
    <div className="relative">
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

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">Get Decision Updates</h3>
                <p className="text-sm text-gray-600">We'll notify you when this application is decided</p>
              </div>
            </div>
            <Button onClick={() => setShowEmailDialog(true)}>
              Get notified
            </Button>
          </div>
        </Card>

        <ApplicationComments />
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};