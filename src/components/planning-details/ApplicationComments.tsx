import { Card } from "@/components/ui/card";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";
import { useState } from "react";
import { Comment } from "@/types/planning";

interface ApplicationCommentsProps {
  applicationId: number;
}

export const ApplicationComments = ({ applicationId }: ApplicationCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">Comments</h3>
      <CommentForm applicationId={applicationId} />
      <CommentList 
        comments={comments} 
        currentUserId="" 
        setComments={setComments}
        applicationId={applicationId}
      />
    </Card>
  );
};