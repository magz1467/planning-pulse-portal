import { Comment } from "@/types/planning";
import { CommentItem } from "./CommentItem";
import { Dispatch, SetStateAction } from "react";

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  setComments: Dispatch<SetStateAction<Comment[]>>;
}

export const CommentList = ({ comments, currentUserId, setComments }: CommentListProps) => {
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