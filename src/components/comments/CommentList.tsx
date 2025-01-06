import { useEffect } from 'react';
import { Comment } from '@/types/planning';
import { CommentItem } from './CommentItem';
import { useComments } from './hooks/useComments';
import { useRealtimeComments } from './hooks/useRealtimeComments';

interface CommentListProps {
  applicationId: number;
}

export const CommentList = ({ applicationId }: CommentListProps) => {
  const { comments, currentUserId, setComments } = useComments(applicationId);
  const { subscribeToComments } = useRealtimeComments(applicationId) || {};

  useEffect(() => {
    if (subscribeToComments) {
      const unsubscribe = subscribeToComments();
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [subscribeToComments]);

  if (!comments) {
    return <div>Loading comments...</div>;
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