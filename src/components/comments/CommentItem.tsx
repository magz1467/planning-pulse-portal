import { useState } from 'react';
import { Comment } from '@/types/planning';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Reply, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CommentForm } from './CommentForm';

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
  const { toast } = useToast();
  const maxLevel = 3;

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUserId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote on comments",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('comment_votes')
        .select('*')
        .eq('comment_id', comment.id)
        .eq('user_id', currentUserId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === type) {
          // Remove vote
          await supabase
            .from('comment_votes')
            .delete()
            .eq('comment_id', comment.id)
            .eq('user_id', currentUserId);

          await supabase
            .from('Comments')
            .update({
              [type === 'up' ? 'upvotes' : 'downvotes']: comment[type === 'up' ? 'upvotes' : 'downvotes'] - 1
            })
            .eq('id', comment.id);

          setVoteStatus(null);
        } else {
          // Change vote
          await supabase
            .from('comment_votes')
            .update({ vote_type: type })
            .eq('comment_id', comment.id)
            .eq('user_id', currentUserId);

          await supabase
            .from('Comments')
            .update({
              [type === 'up' ? 'upvotes' : 'downvotes']: comment[type === 'up' ? 'upvotes' : 'downvotes'] + 1,
              [type === 'up' ? 'downvotes' : 'upvotes']: comment[type === 'up' ? 'downvotes' : 'upvotes'] - 1
            })
            .eq('id', comment.id);

          setVoteStatus(type);
        }
      } else {
        // Add new vote
        await supabase
          .from('comment_votes')
          .insert({
            comment_id: comment.id,
            user_id: currentUserId,
            vote_type: type
          });

        await supabase
          .from('Comments')
          .update({
            [type === 'up' ? 'upvotes' : 'downvotes']: comment[type === 'up' ? 'upvotes' : 'downvotes'] + 1
          })
          .eq('id', comment.id);

        setVoteStatus(type);
      }

      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully"
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "There was an error recording your vote",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`pl-${level * 4} mb-4`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-600">
            {comment.user?.email || 'Anonymous'} • {new Date(comment.created_at).toLocaleDateString()}
          </div>
          {currentUserId === comment.user_id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(comment.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-800 mb-3">{comment.comment}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('up')}
            className={voteStatus === 'up' ? 'text-green-500' : ''}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {comment.upvotes || 0}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote('down')}
            className={voteStatus === 'down' ? 'text-red-500' : ''}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            {comment.downvotes || 0}
          </Button>
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