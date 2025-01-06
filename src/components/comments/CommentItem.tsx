import { Comment } from "@/types/planning";
import { Dispatch, SetStateAction } from "react";

export interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  setComments: Dispatch<SetStateAction<Comment[]>>;
}

export const CommentItem = ({ comment, currentUserId, setComments }: CommentItemProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{comment.user_email}</p>
          <p className="mt-1">{comment.comment}</p>
        </div>
      </div>
    </div>
  );
};