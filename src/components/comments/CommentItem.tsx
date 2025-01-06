import { useState } from 'react';
import { Comment } from '@/types/planning';
import { Button } from '@/components/ui/button';
import { Reply } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentVoteButtons } from './CommentVoteButtons';
import { CommentHeader } from './CommentHeader';
import { CommentContent } from './CommentContent';

interface CommentItemProps {
  comment: Comment;
  applicationId: number;
  onReply?: (parentId: number) => void;
  level?: number;
  replies?: Comment[];
  currentUserId?: string;
  onDelete?: (commentId: number) => void;
}

export const CommentItem = ({ 
  comment, 
  applicationId,
  onReply,
  level = 0,
  replies = [],
  currentUserId,
  onDelete
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const maxLevel = 3;

  const displayName = comment.profiles?.username || 'Anonymous';

  const handleVote = async (type: 'up' | 'down') => {
    setVoteStatus(prev => prev === type ? null : type);
  };

  return (
    <div className={`pl-${level * 4} mb-4`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <CommentHeader 
          displayName={displayName}
          createdAt={comment.created_at}
          canDelete={currentUserId === comment.user_id}
          onDelete={() => onDelete?.(comment.id)}
        />
        
        <CommentContent comment={comment.comment} />
        
        <div className="flex items-center gap-2">
          <CommentVoteButtons
            upvotes={comment.upvotes || 0}
            downvotes={comment.downvotes || 0}
            voteStatus={voteStatus}
            onVote={handleVote}
            currentUserId={currentUserId}
          />
          
          {level < maxLevel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="mt-2 pl-4">
          <CommentForm
            applicationId={applicationId}
            parentId={comment.id}
            onSubmit={() => setIsReplying(false)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              applicationId={applicationId}
              level={level + 1}
              replies={[]}
              currentUserId={currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};