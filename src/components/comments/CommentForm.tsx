import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types/planning";

interface CommentFormProps {
  onSubmit: (comment: Comment) => void;
}

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      content,
      author: "Anonymous",
      timestamp: new Date().toISOString(),
    };

    onSubmit(newComment);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="w-full"
      />
      <Button type="submit">Submit Comment</Button>
    </form>
  );
};