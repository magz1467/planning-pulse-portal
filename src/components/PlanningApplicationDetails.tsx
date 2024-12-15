import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { CommentForm } from "@/components/CommentForm";
import { useState } from "react";

interface PlanningApplicationDetailsProps {
  application: Application;
  onClose: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleCommentSubmit = (content: string) => {
    const newComment = {
      id: comments.length + 1,
      content,
      author: "Anonymous",
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        className="mb-4 pl-0 hover:pl-2 transition-all"
        onClick={onClose}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to list
      </Button>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{application.title}</h2>
          <p className="text-gray-600 mb-2">{application.address}</p>
          <div className="flex gap-2">
            <Badge>{application.status}</Badge>
            <Badge variant="outline">{application.type}</Badge>
          </div>
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
          <h3 className="font-semibold mb-4">Comments</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.author} - {new Date(comment.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <CommentForm onSubmit={handleCommentSubmit} />
        </Card>
      </div>
    </div>
  );
};