import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, ThumbsDown, Bell } from "lucide-react";
import { Application } from "@/types/planning";
import { ApplicationImage } from "./ApplicationImage";
import { ApplicationMeta } from "./ApplicationMeta";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { EmailDialog } from "@/components/EmailDialog";
import { getImageUrl } from "@/utils/imageUtils";

interface ApplicationCardProps {
  application: Application;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ApplicationCard = ({
  application,
  isSelected = false,
  onClick,
}: ApplicationCardProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handleFeedback = async (type: "support" | "object", e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Feedback submitted",
        description: `Thank you for your ${type === "support" ? "support" : "objection"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = (radius: string) => {
    toast({
      title: "Notification setup",
      description: `We'll notify you when a decision is made on this application.`,
      duration: 5000,
    });
    setShowEmailDialog(false);
  };

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all p-4 ${
        isSelected ? "border-primary shadow-lg" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      {application.image && (
        <ApplicationImage src={getImageUrl(application.image)} alt={application.title} />
      )}

      <h3 className="font-semibold text-primary mt-3">{application.title}</h3>
      
      <ApplicationMeta status={application.status} distance={application.distance} />
      
      <p className="text-sm text-gray-600 mt-2">{application.address}</p>
      <p className="text-xs text-gray-500 mt-1">Ref: {application.reference}</p>
      
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={(e) => handleFeedback("support", e)}
              disabled={isSubmitting}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              Support
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={(e) => handleFeedback("object", e)}
              disabled={isSubmitting}
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              Object
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setShowEmailDialog(true);
            }}
            disabled={isSubmitting}
          >
            <Bell className="w-3 h-3 mr-1" />
            Get Updates
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs w-full"
          onClick={(e) => e.stopPropagation()}
          disabled={isSubmitting}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Add Comment
        </Button>
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode={application.postcode}
      />
    </Card>
  );
};
