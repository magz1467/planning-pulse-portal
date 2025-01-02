import { Comment } from "@/types/planning";

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{(comment.user as any)?.email || 'Anonymous'}</span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p>{comment.comment}</p>
        </div>
      ))}
    </div>
  );
};