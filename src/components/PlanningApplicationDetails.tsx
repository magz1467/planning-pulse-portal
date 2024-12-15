import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Application } from "@/types/planning";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PlanningApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const handleFeedback = (type: 'positive' | 'negative') => {
    toast({
      title: "Thank you for your feedback",
      description: "Your response has been recorded.",
      duration: 3000,
    });
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: comments.length + 1,
      text: commentText,
      author: "Anonymous User",
      date: new Date().toLocaleDateString()
    };

    setComments([...comments, newComment]);
    setCommentText("");
    
    toast({
      title: "Comment submitted successfully",
      description: "Your comment has been sent to the planning developer for review.",
      duration: 3000,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Application Details</h2>
        <Button
          variant="ghost"
          onClick={onClose}
          className="text-gray-500"
        >
          ✕
        </Button>
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
          <p className="text-gray-600 text-sm">{application.description}</p>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Quick Feedback</h4>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleFeedback('positive')}
            >
              <ThumbsUp className="mr-2" /> Support
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleFeedback('negative')}
            >
              <ThumbsDown className="mr-2" /> Object
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Leave a Comment</h4>
          <Textarea
            placeholder="Share your thoughts about this planning application..."
            className="mb-4"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            onClick={handleCommentSubmit}
            className="w-full"
          >
            Submit Comment
          </Button>
        </div>

        {comments.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Other Comments</h4>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{comment.text}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{comment.author}</span>
                    <span>{comment.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};