import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ThumbsUp, ThumbsDown } from "lucide-react";
import { CommentForm } from "@/components/comments/CommentForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FullScreenDetailsProps {
  application: Application;
  onClose: () => void;
  onCommentSubmit: (content: string) => void;
}

export const FullScreenDetails = ({
  application,
  onClose,
  onCommentSubmit,
}: FullScreenDetailsProps) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const { toast } = useToast();

  const handleFeedback = (type: 'up' | 'down') => {
    if (feedback === type) {
      setFeedback(null);
      toast({
        title: "Feedback removed",
        description: "Your feedback has been removed",
      });
    } else {
      setFeedback(type);
      toast({
        title: "Thank you for your feedback",
        description: type === 'up' ? "We're glad this was helpful!" : "We'll work on improving this",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 pb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{application.title}</h2>
            <p className="text-gray-600 mb-2">{application.address}</p>
            <div className="flex gap-2">
              <Badge>{application.status}</Badge>
              <Badge variant="outline">{application.type}</Badge>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant={feedback === 'up' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeedback('up')}
            >
              <ThumbsUp className={`h-4 w-4 ${feedback === 'up' ? 'text-white' : 'text-gray-600'}`} />
            </Button>
            <Button
              variant={feedback === 'down' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeedback('down')}
            >
              <ThumbsDown className={`h-4 w-4 ${feedback === 'down' ? 'text-white' : 'text-gray-600'}`} />
            </Button>
          </div>

          {application.image && (
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src={application.image}
                alt={application.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Application Details</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-600">Reference:</dt>
              <dd>{application.reference}</dd>
              <dt className="text-gray-600">Applicant:</dt>
              <dd>{application.applicant}</dd>
              <dt className="text-gray-600">Submission Date:</dt>
              <dd>{application.submissionDate}</dd>
              <dt className="text-gray-600">Decision Due:</dt>
              <dd>{application.decisionDue}</dd>
              <dt className="text-gray-600">Ward:</dt>
              <dd>{application.ward}</dd>
              <dt className="text-gray-600">Case Officer:</dt>
              <dd>{application.officer}</dd>
              <dt className="text-gray-600">Consultation End:</dt>
              <dd>{application.consultationEnd}</dd>
            </dl>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm">{application.description}</p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Add a Comment</h3>
            <CommentForm onSubmit={onCommentSubmit} />
          </Card>
        </div>
      </div>
    </div>
  );
};