import { Comment } from "@/types/planning";

interface CommentListProps {
  comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
  if (comments.length === 0) return null;

  return (
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4">Other Comments</h4>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">{comment.text}</p>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>{comment.author}</span>
              <span>{comment.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};