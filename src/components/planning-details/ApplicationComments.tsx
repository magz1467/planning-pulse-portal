import { Card } from '@/components/ui/card';
import { CommentList } from '@/components/comments/CommentList';

interface ApplicationCommentsProps {
  applicationId: number;
}

export const ApplicationComments = ({ applicationId }: ApplicationCommentsProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Comments</h3>
      <CommentList applicationId={applicationId} />
    </Card>
  );
};