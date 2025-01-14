import { Application } from "@/types/planning";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { EmailDialog } from "./EmailDialog";
import { FeedbackEmailDialog } from "./FeedbackEmailDialog";
import { AuthRequiredDialog } from "./AuthRequiredDialog";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ApplicationMetadata } from "./planning-details/ApplicationMetadata";
import { ApplicationActions } from "./planning-details/ApplicationActions";
import { ApplicationContent } from "./planning-details/ApplicationContent";
import { Wand2 } from "lucide-react";

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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(application);
  const { toast } = useToast();
  const { savedApplications, toggleSavedApplication } = useSavedApplications();

  useEffect(() => {
    console.log('PlanningApplicationDetails - Application Data:', {
      id: application?.id,
      class_3: application?.class_3,
      title: application?.title
    });
    
    setCurrentApplication(application);
    
    return () => {
      setShowEmailDialog(false);
      setShowFeedbackDialog(false);
      setShowAuthDialog(false);
      document.body.style.overflow = '';
    };
  }, [application]);

  if (!currentApplication) return null;

  const isSaved = savedApplications.includes(currentApplication.id);

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

    toggleSavedApplication(currentApplication.id);
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

  const handleRegenerateTitle = async () => {
    if (!currentApplication.description) {
      toast({
        title: "Cannot regenerate title",
        description: "No description available to generate title from",
        variant: "destructive"
      });
      return;
    }

    setIsRegenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-listing-header', {
        body: { description: currentApplication.description }
      });

      if (response.error) throw response.error;

      const { header } = response.data;

      const { error: updateError } = await supabase
        .from('applications')
        .update({ ai_title: header })
        .eq('application_id', currentApplication.id);

      if (updateError) throw updateError;

      // Update local state instead of reloading
      setCurrentApplication(prev => prev ? {
        ...prev,
        ai_title: header
      } : prev);

      toast({
        title: "Title regenerated",
        description: "The application title has been updated successfully"
      });

    } catch (error) {
      console.error('Error regenerating title:', error);
      toast({
        title: "Error regenerating title",
        description: "There was a problem updating the title. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-4 pb-20">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <ApplicationMetadata 
            application={currentApplication}
            onShowEmailDialog={() => setShowEmailDialog(true)}
          />
        </div>
        {!currentApplication.ai_title && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateTitle}
            disabled={isRegenerating || !currentApplication.description}
            className="whitespace-nowrap text-xs"
          >
            <Wand2 className="w-3 h-3 mr-1" />
            {isRegenerating ? 'Regenerating...' : 'Regenerate Title'}
          </Button>
        )}
      </div>
      
      <ApplicationActions 
        applicationId={currentApplication.id}
        reference={currentApplication.reference}
        isSaved={isSaved}
        onSave={handleSave}
        onShowEmailDialog={() => setShowEmailDialog(true)}
      />

      <ApplicationContent 
        application={currentApplication}
        feedback={feedback}
        feedbackStats={feedbackStats}
        onFeedback={handleFeedback}
      />

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

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={currentApplication?.postcode || ''}
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