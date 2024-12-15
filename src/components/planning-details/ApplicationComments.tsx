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
  );
};