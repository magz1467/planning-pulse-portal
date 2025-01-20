import { Comment } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { CommentHeader } from "./CommentHeader";
import { CommentContent } from "./CommentContent";
import { CommentVotes } from "./CommentVotes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
}

export const CommentItem = ({ comment, currentUserId }: CommentItemProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes || 0);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!currentUserId) return;

      const { data } = await supabase
        .from('comment_votes')
        .select('vote_type')
        .eq('comment_id', comment.id)
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (data) {
        setVoteStatus(data.vote_type as 'up' | 'down');
      }
    };

    fetchVoteStatus();
  }, [comment.id, currentUserId]);

  const handleVoteChange = async (type: 'up' | 'down') => {
    if (!currentUserId) return;

    const isRemovingVote = type === voteStatus;
    
    // Optimistically update UI
    if (isRemovingVote) {
      if (type === 'up') setUpvotes(prev => prev - 1);
      if (type === 'down') setDownvotes(prev => prev - 1);
      setVoteStatus(null);
    } else {
      // If changing vote type, remove old vote first
      if (voteStatus === 'up') setUpvotes(prev => prev - 1);
      if (voteStatus === 'down') setDownvotes(prev => prev - 1);
      
      // Add new vote
      if (type === 'up') setUpvotes(prev => prev + 1);
      if (type === 'down') setDownvotes(prev => prev + 1);
      setVoteStatus(type);
    }

    try {
      if (isRemovingVote) {
        await supabase
          .from('comment_votes')
          .delete()
          .eq('comment_id', comment.id)
          .eq('user_id', currentUserId);
      } else {
        await supabase
          .from('comment_votes')
          .upsert({
            comment_id: comment.id,
            user_id: currentUserId,
            vote_type: type
          }, {
            onConflict: 'comment_id,user_id'
          });
      }

      // Update the comment's vote counts in the database
      await supabase
        .from('Comments')
        .update({
          upvotes: upvotes,
          downvotes: downvotes
        })
        .eq('id', comment.id);
    } catch (error) {
      console.error('Error updating vote:', error);
      // Revert optimistic updates on error
      setVoteStatus(voteStatus);
      setUpvotes(comment.upvotes || 0);
      setDownvotes(comment.downvotes || 0);
    }
  };

  return (
    <Card className="p-4">
      <CommentHeader comment={comment} />
      <CommentContent comment={comment} />
      <div className="mt-2">
        <CommentVotes
          commentId={comment.id}
          upvotes={upvotes}
          downvotes={downvotes}
          currentUserId={currentUserId}
          voteStatus={voteStatus}
          onVoteChange={handleVoteChange}
        />
      </div>
    </Card>
  );
};