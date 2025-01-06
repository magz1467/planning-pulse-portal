import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommentVotesProps {
  commentId: number;
  upvotes: number;
  downvotes: number;
  currentUserId?: string;
  voteStatus: 'up' | 'down' | null;
  onVoteChange: (type: 'up' | 'down') => void;
}

export const CommentVotes = ({ 
  commentId, 
  upvotes = 0, 
  downvotes = 0,
  currentUserId,
  voteStatus,
  onVoteChange
}: CommentVotesProps) => {
  const { toast } = useToast();

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUserId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to vote on comments",
        variant: "destructive"
      });
      return;
    }

    onVoteChange(type);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('up')}
        className={voteStatus === 'up' ? 'text-green-500' : ''}
      >
        <ThumbsUp className="h-4 w-4 mr-1" />
        {upvotes || 0}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('down')}
        className={voteStatus === 'down' ? 'text-red-500' : ''}
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
        {downvotes || 0}
      </Button>
    </div>
  );
};