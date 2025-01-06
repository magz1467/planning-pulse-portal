interface CommentContentProps {
  content: string;
}

export const CommentContent = ({ content }: CommentContentProps) => {
  return (
    <div className="text-sm text-gray-800">
      {content}
    </div>
  );
}
