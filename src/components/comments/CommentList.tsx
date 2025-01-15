import { useState, useEffect } from 'react';
import { Comment } from '@/types/planning';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useComments } from './hooks/useComments';
import { Card } from '@/components/ui/card';

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

  if (!comments?.length) {
    return (
      <Card className="p-4">
        <div className="text-center text-gray-500">
          <p>No comments yet</p>
          <p className="text-sm">Be the first to comment on this application</p>
        </div>
        <CommentForm applicationId={applicationId} setComments={setComments} />
      </Card>
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