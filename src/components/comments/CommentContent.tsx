interface CommentContentProps {
  comment: string;
}

export const CommentContent = ({ comment }: CommentContentProps) => {
  return <p className="text-gray-800 mb-3">{comment}</p>;
};