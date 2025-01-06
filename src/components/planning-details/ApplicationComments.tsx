import { Card } from "@/components/ui/card";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentList } from "@/components/comments/CommentList";

interface ApplicationCommentsProps {
  applicationId: number;
}

export const ApplicationComments = ({ applicationId }: ApplicationCommentsProps) => {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-semibold">Comments</h3>
      <CommentForm applicationId={applicationId} />
      <CommentList applicationId={applicationId} />
    </Card>
  );
};