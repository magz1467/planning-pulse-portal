import { Application } from "@/types/planning";
import { ApplicationHeader } from "./planning-details/ApplicationHeader";
import { ApplicationImage } from "./planning-details/ApplicationImage";
import { ApplicationDetails } from "./planning-details/ApplicationDetails";
import { ApplicationDescription } from "./planning-details/ApplicationDescription";
import { ApplicationComments } from "./planning-details/ApplicationComments";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmailDialog } from "./EmailDialog";
import { FeedbackEmailDialog } from "./FeedbackEmailDialog";

interface PlanningApplicationDetailsProps {
  application?: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top when component mounts or application changes
    const detailsContainer = document.querySelector('.planning-details-container');
    if (detailsContainer) {
      detailsContainer.scrollTop = 0;
    }
  }, [application]);

  if (!application) return null;

  // Mock data for feedback counts - in a real application, this would come from your backend
  const feedbackStats = {
    thumbsUp: feedback === 'up' ? 13 : 12,
    thumbsDown: feedback === 'down' ? 4 : 3
  };

  const handleEmailSubmit = (email: string, radius: string) => {
    toast({
      title: "Notification setup",
      description: `We'll email you at ${email} when a decision is made on this application.`,
      duration: 5000,
    });
  };

  const handleFeedbackEmailSubmit = (email: string) => {
    toast({
      title: "Developer verification pending",
      description: "We'll verify your email and send you access to view all feedback for this application.",
      duration: 5000,
    });
    setShowFeedbackDialog(false);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(prev => prev === type ? null : type);
    
    toast({
      title: type === feedback ? "Feedback removed" : "Thank you for your feedback",
      description: type === feedback 
        ? "Your feedback has been removed"
        : type === 'up' 
          ? "We're glad this was helpful!" 
          : "We'll work on improving this",
    });
  };

  return (
    <div className="relative planning-details-container">
      <div className="p-6 space-y-4">
        <ApplicationHeader application={application} />
        <ApplicationImage application={application} />
        <ApplicationDetails application={application} />
        <ApplicationDescription application={application} />
        
        <Card className="p-4 hover:border-primary transition-colors">
          <h3 className="font-semibold mb-4">Community Feedback</h3>
          <div className="flex gap-8">
            <Button
              variant={feedback === 'up' ? "default" : "outline"}
              onClick={() => handleFeedback('up')}
              className="flex items-center gap-2"
            >
              <ThumbsUp className={`h-5 w-5 ${
                feedback === 'up' ? 'text-white' : 'text-primary'
              }`} />
              <span className="text-lg font-medium">{feedbackStats.thumbsUp}</span>
              <span className={`text-sm ${
                feedback === 'up' ? 'text-white' : 'text-gray-500'
              }`}>people like this</span>
            </Button>
            <Button
              variant={feedback === 'down' ? "outline" : "outline"}
              onClick={() => handleFeedback('down')}
              className={`flex items-center gap-2 ${
                feedback === 'down' ? 'bg-[#ea384c]/10' : ''
              }`}
            >
              <ThumbsDown className={`h-5 w-5 ${
                feedback === 'down' ? 'text-[#ea384c]' : 'text-gray-600'
              }`} />
              <span className="text-lg font-medium">{feedbackStats.thumbsDown}</span>
              <span className="text-sm text-gray-500">people dislike this</span>
            </Button>
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

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Is this your development?</h3>
              <p className="text-sm text-gray-600">Click here to verify and see full feedback</p>
            </div>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(true)}>
              Get feedback
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

      <FeedbackEmailDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onSubmit={handleFeedbackEmailSubmit}
      />
    </div>
  );
};