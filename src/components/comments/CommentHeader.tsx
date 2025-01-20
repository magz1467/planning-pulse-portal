import { Comment } from "@/types/planning";

export interface CommentHeaderProps {
  comment: Comment;
}

export const CommentHeader = ({ comment }: CommentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <span className="font-medium">
          {comment.user?.username || comment.user_email || 'Anonymous'}
        </span>
        <span className="text-sm text-muted-foreground">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};