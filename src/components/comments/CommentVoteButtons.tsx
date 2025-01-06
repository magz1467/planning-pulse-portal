import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from 'react';

interface CommentVoteButtonsProps {
  commentId: number;
  currentUserId: string;
  upvotes: number;
  downvotes: number;
}

export const CommentVoteButtons = ({
  commentId,
  currentUserId,
  upvotes,
  downvotes
}: CommentVoteButtonsProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUserId) return;
    // Update vote status
    setVoteStatus(type);
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