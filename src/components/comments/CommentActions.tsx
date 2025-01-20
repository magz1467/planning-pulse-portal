import { Button } from "@/components/ui/button";
import { MessageSquarePlus, ChevronDown, ChevronRight } from "lucide-react";

interface CommentActionsProps {
  currentUserId?: string;
  level: number;
  repliesCount: number;
  isExpanded: boolean;
  onReplyClick: () => void;
  onExpandClick: () => void;
}

export const CommentActions = ({
  currentUserId,
  level,
  repliesCount,
  isExpanded,
  onReplyClick,
  onExpandClick
}: CommentActionsProps) => {
  const maxLevel = 3;

  return (
    <div className="mt-2 flex items-center space-x-4">
      {currentUserId && level < maxLevel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReplyClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Reply
        </Button>
      )}
      {repliesCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onExpandClick}
          className="text-muted-foreground hover:text-foreground ml-auto"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1" />
          )}
          {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
        </Button>
      )}
    </div>
  );
};