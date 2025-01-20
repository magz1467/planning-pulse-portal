import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  upvotes,
  downvotes,
  currentUserId,
  voteStatus,
  onVoteChange
}: CommentVotesProps) => {
  const { toast } = useToast();

  const handleVote = (type: 'up' | 'down') => {
    if (!currentUserId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote on comments",
        variant: "destructive"
      });
      return;
    }
    onVoteChange(type);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          className={`hover:bg-primary/10 ${voteStatus === 'up' ? 'text-primary' : ''}`}
          onClick={() => handleVote('up')}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          <span>{upvotes}</span>
        </Button>
      </div>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm"
          className={`hover:bg-primary/10 ${voteStatus === 'down' ? 'text-primary' : ''}`}
          onClick={() => handleVote('down')}
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          <span>{downvotes}</span>
        </Button>
      </div>
    </div>
  );
};