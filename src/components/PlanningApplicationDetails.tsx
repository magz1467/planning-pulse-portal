import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmailDialog } from "./EmailDialog";
import { FeedbackEmailDialog } from "./FeedbackEmailDialog";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { AuthRequiredDialog } from "./AuthRequiredDialog";
import { supabase } from "@/integrations/supabase/client";
import { DetailContent } from "./planning-details/components/DetailContent";
import { ActionButtons } from "./planning-details/components/ActionButtons";
import { Link } from "react-router-dom";

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
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const { toast } = useToast();
  const { savedApplications, toggleSavedApplication } = useSavedApplications();

  useEffect(() => {
    return () => {
      setShowEmailDialog(false);
      setShowFeedbackDialog(false);
      setShowAuthDialog(false);
      document.body.style.overflow = '';
    };
  }, []);

  if (!application) return null;

  const isSaved = savedApplications.includes(application.id);
  const feedbackStats = {
    thumbsUp: feedback === 'up' ? 13 : 12,
    thumbsDown: feedback === 'down' ? 4 : 3
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    toggleSavedApplication(application.id);
    toast({
      title: isSaved ? "Application removed" : "Application saved",
      description: isSaved 
        ? "The application has been removed from your saved list" 
        : "The application has been added to your saved list. View all your saved applications.",
      action: !isSaved ? (
        <Link to="/saved" className="text-primary hover:underline">
          View saved
        </Link>
      ) : undefined
    });
  };

  const handleEmailSubmit = (radius: string) => {
    toast({
      title: "Notification setup",
      description: `We'll notify you when a decision is made on this application.`,
      duration: 5000,
    });
    setShowEmailDialog(false);
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
    <div className="p-6 space-y-4 pb-20">
      <DetailContent 
        application={application}
        feedback={feedback}
        handleFeedback={handleFeedback}
        feedbackStats={feedbackStats}
      />

      <ActionButtons
        applicationId={application.id}
        isSaved={isSaved}
        handleSave={handleSave}
        setShowEmailDialog={setShowEmailDialog}
        setShowFeedbackDialog={setShowFeedbackDialog}
      />

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={application.postcode || ''}
      />

      <FeedbackEmailDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onSubmit={handleFeedbackEmailSubmit}
      />

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </div>
  );
};
