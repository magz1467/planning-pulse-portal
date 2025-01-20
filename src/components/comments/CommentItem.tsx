import { Comment } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommentHeader } from "./CommentHeader";
import { CommentContent } from "./CommentContent";
import { CommentVotes } from "./CommentVotes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquarePlus, ChevronDown, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
      setIsExpanded(true); // Auto-expand when adding a new reply
      
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

  // Limit nesting level to 3 to prevent deep threads
  const maxLevel = 3;

  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`}>
      <Card className="p-4">
        <CommentHeader comment={comment} />
        <CommentContent comment={comment} />
        <div className="mt-2 flex items-center space-x-4">
          <CommentVotes
            commentId={comment.id}
            upvotes={upvotes}
            downvotes={downvotes}
            currentUserId={currentUserId}
            voteStatus={voteStatus}
            onVoteChange={handleVoteChange}
          />
          {currentUserId && level < maxLevel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-muted-foreground hover:text-foreground"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Reply
            </Button>
          )}
          {replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground ml-auto"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </Button>
          )}
        </div>

        {isReplying && (
          <div className="mt-4 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyContent.trim()}
              >
                Post Reply
              </Button>
            </div>
          </div>
        )}
      </Card>

      {replies.length > 0 && isExpanded && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              level={level + 1}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};