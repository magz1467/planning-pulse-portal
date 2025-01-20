import { Comment } from "@/types/planning";
import { CommentItem } from "./CommentItem";

interface CommentRepliesProps {
  replies: Comment[];
  currentUserId?: string;
  level: number;
  isExpanded: boolean;
  onReplyAdded?: (newComment: Comment) => void;
}

export const CommentReplies = ({
  replies,
  currentUserId,
  level,
  isExpanded,
  onReplyAdded
}: CommentRepliesProps) => {
  if (!replies.length || !isExpanded) return null;

  return (
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
  );
};