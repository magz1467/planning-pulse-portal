import { useState } from 'react';
import { Comment } from '@/types/planning';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { useComments } from './hooks/useComments';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentListProps {
  applicationId: number;
}

export const CommentList = ({ applicationId }: CommentListProps) => {
  const { comments, isLoading, setComments } = useComments(applicationId);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CommentForm applicationId={applicationId} setComments={setComments} />
      {comments?.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};