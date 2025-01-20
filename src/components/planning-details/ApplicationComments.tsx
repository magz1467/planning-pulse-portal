import { Card } from '@/components/ui/card';
import { CommentList } from '@/components/comments/CommentList';

interface ApplicationCommentsProps {
  applicationId: number;
}

export const ApplicationComments = ({ applicationId }: ApplicationCommentsProps) => {
  return (
    <Card className="p-6 border-2 border-primary/20 shadow-sm">
      <div className="space-y-4">
        <div className="border-b border-primary/10 pb-4">
          <h3 className="font-playfair text-2xl text-primary mb-2">Comments</h3>
          <p className="text-muted-foreground text-sm">
            Let everyone know what you think or ask any questions
          </p>
        </div>
        <CommentList applicationId={applicationId} />
      </div>
    </Card>
  );
};