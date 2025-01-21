import { Comment } from "@/types/planning";

export interface CommentHeaderProps {
  comment: Comment;
}

export const CommentHeader = ({ comment }: CommentHeaderProps) => {
  // Prioritize username from profiles, then user object, then email, finally fallback to Anonymous
  const displayName = comment.profiles?.username || 
                     comment.user?.username || 
                     comment.user_email || 
                     'Anonymous';

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <span className="font-medium">
          {displayName}
        </span>
        <span className="text-sm text-muted-foreground">
          {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};