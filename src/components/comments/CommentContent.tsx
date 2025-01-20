import { Comment } from "@/types/planning";

export interface CommentContentProps {
  comment: Comment;
}

export const CommentContent = ({ comment }: CommentContentProps) => {
  return (
    <div className="text-sm text-muted-foreground">
      {comment.comment}
    </div>
  );
};