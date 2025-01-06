import { Comment } from "@/types/planning";
import { CommentItem } from "./CommentItem";
import { Dispatch, SetStateAction } from "react";

export interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  setComments: Dispatch<SetStateAction<Comment[]>>;
  applicationId?: number;
}

export const CommentList = ({ comments = [], currentUserId, setComments }: CommentListProps) => {
  if (!comments) return null;
  
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