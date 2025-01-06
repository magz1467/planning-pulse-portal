import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface CommentVoteButtonsProps {
  upvotes: number;
  downvotes: number;
  voteStatus: 'up' | 'down' | null;
  onVote: (type: 'up' | 'down') => void;
  currentUserId?: string;
}

export const CommentVoteButtons = ({
  upvotes,
  downvotes,
  voteStatus,
  onVote,
  currentUserId
}: CommentVoteButtonsProps) => {
  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUserId) return;
    onVote(type);
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