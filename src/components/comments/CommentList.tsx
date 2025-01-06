import { Comment } from "@/types/planning";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export const CommentList = ({ 
  comments,
  currentUserId,
  setComments
}: CommentListProps) => {
  if (!comments.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          setComments={setComments}
        />
      ))}
    </div>
  );
};