import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "@/types/planning";

interface CommentFormProps {
  onCommentSubmit: (comment: Comment) => void;
}

export const CommentForm = ({ onCommentSubmit }: CommentFormProps) => {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      text: commentText,
      author: "Anonymous User",
      date: new Date().toLocaleDateString()
    };

    onCommentSubmit(newComment);
    setCommentText("");
    
    toast({
      title: "Comment submitted successfully",
      description: "Your comment has been sent to the planning developer for review.",
      duration: 3000,
    });
  };

  return (
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4">Leave a Comment</h4>
      <Textarea
        placeholder="Share your thoughts about this planning application..."
        className="mb-4"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        className="w-full"
      >
        Submit Comment
      </Button>
    </div>
  );
};