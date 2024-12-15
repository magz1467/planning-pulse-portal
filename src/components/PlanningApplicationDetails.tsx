import { ThumbsUp, ThumbsDown, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Application, Comment } from "@/types/planning";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CommentForm } from "./comments/CommentForm";
import { CommentList } from "./comments/CommentList";

interface PlanningApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setSelectedFeedback(type);
    toast({
      title: "Thank you for your feedback",
      description: "Your response has been recorded.",
      duration: 3000,
    });
  };

  const handleCommentSubmit = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  const handleShare = () => {
    const shareText = `Check out this planning application: ${application.title} at ${application.address}. Reference: ${application.reference}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Sharing via WhatsApp",
      description: "Opening WhatsApp to share this application",
      duration: 3000,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Application Details</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="text-gray-500"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-primary">{application.title}</h3>
          <p className="text-gray-600 mt-1">{application.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Reference</p>
            <p className="text-gray-600">{application.reference}</p>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p className="text-gray-600">{application.status}</p>
          </div>
          <div>
            <p className="font-semibold">Submission Date</p>
            <p className="text-gray-600">{application.submissionDate}</p>
          </div>
          <div>
            <p className="font-semibold">Decision Due</p>
            <p className="text-gray-600">{application.decisionDue}</p>
          </div>
          <div>
            <p className="font-semibold">Type</p>
            <p className="text-gray-600">{application.type}</p>
          </div>
          <div>
            <p className="font-semibold">Ward</p>
            <p className="text-gray-600">{application.ward}</p>
          </div>
          <div>
            <p className="font-semibold">Case Officer</p>
            <p className="text-gray-600">{application.officer}</p>
          </div>
          <div>
            <p className="font-semibold">Consultation Ends</p>
            <p className="text-gray-600">{application.consultationEnd}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-gray-600 text-sm">
            {application.description || "No detailed description available for this planning application"}
          </p>
        </div>

        <CommentList comments={comments} />

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Quick Feedback</h4>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className={`flex-1 ${
                selectedFeedback === 'positive' ? 'bg-[#F2FCE2] border-primary text-primary' : ''
              }`}
              onClick={() => handleFeedback('positive')}
            >
              <ThumbsUp className="mr-2" /> Support
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${
                selectedFeedback === 'negative' ? 'bg-[#FFDEE2] border-destructive text-destructive' : ''
              }`}
              onClick={() => handleFeedback('negative')}
            >
              <ThumbsDown className="mr-2" /> Object
            </Button>
          </div>
          {selectedFeedback && (
            <p className="text-sm text-gray-600 text-center mt-2">
              Thanks, feedback submitted
            </p>
          )}
        </div>

        <CommentForm onCommentSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
};
