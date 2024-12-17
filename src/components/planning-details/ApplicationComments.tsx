import { Card } from "@/components/ui/card";
import { CommentForm } from "@/components/comments/CommentForm";
import { Comment } from "@/types/planning";
import { useState } from "react";

interface ApplicationCommentsProps {
  initialComments?: Comment[];
}

export const ApplicationComments = ({ initialComments = [] }: ApplicationCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCommentSubmit = (content: string) => {
    const newComment: Comment = {
      id: comments.length + 1,
      content,
      author: "Anonymous",
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  return (
    <Card className="p-4 border-2 border-primary/20 shadow-lg animate-fade-in hover:border-primary/40 transition-colors duration-300">
      <div className="bg-primary/5 -m-4 mb-4 p-4 border-b">
        <h3 className="font-semibold text-lg text-primary mb-2">Have Your Say</h3>
        <p className="text-sm text-gray-600">
          Your feedback submitted here will be shared directly with both the developer and the local council before the consultation deadline.
        </p>
      </div>
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
  );
};