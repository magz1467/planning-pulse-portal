import { useEffect } from "react";
import { CommentItem } from "./CommentItem";
import { useComments } from "./hooks/useComments";
import { useRealtimeComments } from "./hooks/useRealtimeComments";

interface CommentListProps {
  applicationId: number;
}

export const CommentList = ({ applicationId }: CommentListProps) => {
  const { comments, isLoading, error } = useComments(applicationId);
  const { subscribeToComments } = useRealtimeComments(applicationId);

  useEffect(() => {
    // Subscribe to real-time updates for this application's comments
    const unsubscribe = subscribeToComments();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [applicationId, subscribeToComments]);

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error loading comments</div>;
  }

  if (!comments?.length) {
    return <div>No comments yet</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment}
          applicationId={applicationId}
        />
      ))}
    </div>
  );
};