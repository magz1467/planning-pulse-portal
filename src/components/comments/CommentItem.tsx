import { Comment } from '@/types/planning';
import { Card } from '@/components/ui/card';
import { CommentHeader } from './CommentHeader';
import { CommentContent } from './CommentContent';
import { CommentVoteButtons } from './CommentVoteButtons';

export interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
}

export const CommentItem = ({ comment, currentUserId }: CommentItemProps) => {
  return (
    <Card className="p-4">
      <CommentHeader 
        displayName={comment.user?.username || 'Anonymous'} 
        createdAt={comment.created_at || ''} 
        canDelete={currentUserId === comment.user_id}
      />
      <CommentContent content={comment.comment || ''} />
      <CommentVoteButtons 
        commentId={comment.id} 
        currentUserId={currentUserId}
        upvotes={comment.upvotes || 0}
        downvotes={comment.downvotes || 0}
      />
    </Card>
  );
};