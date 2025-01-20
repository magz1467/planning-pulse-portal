import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentReplyFormProps {
  replyContent: string;
  onReplyChange: (content: string) => void;
  onReplySubmit: () => void;
  onReplyCancel: () => void;
}

export const CommentReplyForm = ({
  replyContent,
  onReplyChange,
  onReplySubmit,
  onReplyCancel
}: CommentReplyFormProps) => {
  return (
    <div className="mt-4 space-y-2">
      <Textarea
        value={replyContent}
        onChange={(e) => onReplyChange(e.target.value)}
        placeholder="Write your reply..."
        className="min-h-[100px]"
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReplyCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onReplySubmit}
          disabled={!replyContent.trim()}
        >
          Post Reply
        </Button>
      </div>
    </div>
  );
};