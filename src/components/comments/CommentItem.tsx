import { Comment } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { CommentHeader } from "./CommentHeader";
import { CommentContent } from "./CommentContent";
import { CommentVoteSection } from "./CommentVoteSection";
import { CommentActions } from "./CommentActions";
import { CommentReplyForm } from "./CommentReplyForm";
import { CommentReplies } from "./CommentReplies";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  level?: number;
  onReplyAdded?: (newComment: Comment) => void;
}

export const CommentItem = ({ 
  comment, 
  currentUserId,
  level = 0,
  onReplyAdded 
}: CommentItemProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes || 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

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

    const fetchReplies = async () => {
      const { data: repliesData, error } = await supabase
        .from('Comments')
        .select('*, profiles:profiles(username)')
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching replies:', error);
        return;
      }

      setReplies(repliesData || []);
    };

    fetchVoteStatus();
    fetchReplies();
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
      if (voteStatus === 'up') setUpvotes(prev => prev - 1);
      if (voteStatus === 'down') setDownvotes(prev => prev - 1);
      
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

      await supabase
        .from('Comments')
        .update({
          upvotes: upvotes,
          downvotes: downvotes
        })
        .eq('id', comment.id);
    } catch (error) {
      console.error('Error updating vote:', error);
      setVoteStatus(voteStatus);
      setUpvotes(comment.upvotes || 0);
      setDownvotes(comment.downvotes || 0);
    }
  };

  const handleReply = async () => {
    if (!currentUserId || !replyContent.trim()) return;

    try {
      const { data: newComment, error } = await supabase
        .from('Comments')
        .insert({
          comment: replyContent.trim(),
          application_id: comment.application_id,
          user_id: currentUserId,
          parent_id: comment.id
        })
        .select('*, profiles:profiles(username)')
        .single();

      if (error) throw error;

      setReplies(prev => [...prev, newComment]);
      setReplyContent('');
      setIsReplying(false);
      setIsExpanded(true);
      
      if (onReplyAdded) {
        onReplyAdded(newComment);
      }

      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`}>
      <Card className="p-4">
        <CommentHeader comment={comment} />
        <CommentContent comment={comment} />
        <div className="mt-2 flex items-center space-x-4">
          <CommentVoteSection
            commentId={comment.id}
            upvotes={upvotes}
            downvotes={downvotes}
            currentUserId={currentUserId}
            voteStatus={voteStatus}
            onVoteChange={handleVoteChange}
          />
          <CommentActions
            currentUserId={currentUserId}
            level={level}
            repliesCount={replies.length}
            isExpanded={isExpanded}
            onReplyClick={() => setIsReplying(!isReplying)}
            onExpandClick={() => setIsExpanded(!isExpanded)}
          />
        </div>

        {isReplying && (
          <CommentReplyForm
            replyContent={replyContent}
            onReplyChange={setReplyContent}
            onReplySubmit={handleReply}
            onReplyCancel={() => setIsReplying(false)}
          />
        )}
      </Card>

      <CommentReplies
        replies={replies}
        currentUserId={currentUserId}
        level={level}
        isExpanded={isExpanded}
        onReplyAdded={onReplyAdded}
      />
    </div>
  );
};