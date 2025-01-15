import { useState, useEffect } from 'react';
import { Comment } from '@/types/planning';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useComments } from './hooks/useComments';

interface CommentListProps {
  applicationId: number;
}

export const CommentList = ({ applicationId }: CommentListProps) => {
  const { comments = [], isLoading, currentUserId, setComments } = useComments(applicationId);

  useEffect(() => {
    console.log('CommentList rendered with:', {
      commentsCount: comments?.length || 0,
      applicationId,
      isLoading
    });
  }, [comments, applicationId, isLoading]);

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
          currentUserId={currentUserId || ''}
        />
      ))}
    </div>
  );
};