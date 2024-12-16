import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { PlanningApplication } from "@/types/planning";
import { ApplicationImage } from "./ApplicationImage";
import { ApplicationMeta } from "./ApplicationMeta";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ApplicationCardProps {
  application: PlanningApplication;
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

  const handleFeedback = async (type: "support" | "object") => {
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

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all p-3 ${
        isSelected ? "border-primary shadow-lg" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      {application.image && (
        <ApplicationImage image={application.image} title={application.title} />
      )}

      <h3 className="font-semibold text-primary truncate">{application.title}</h3>
      
      <ApplicationMeta status={application.status} distance={application.distance} />
      
      <p className="text-sm text-gray-600 mt-1 truncate">{application.address}</p>
      
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleFeedback("support");
          }}
          disabled={isSubmitting}
        >
          <ThumbsUp className="w-3 h-3 mr-1" />
          Support
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleFeedback("object");
          }}
          disabled={isSubmitting}
        >
          <ThumbsDown className="w-3 h-3 mr-1" />
          Object
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => e.stopPropagation()}
          disabled={isSubmitting}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Comment
        </Button>
      </div>
    </Card>
  );
};