import { Card } from '@/components/ui/card';
import { CommentList } from '@/components/comments/CommentList';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ApplicationCommentsProps {
  applicationId: number;
}

export const ApplicationComments = ({ applicationId }: ApplicationCommentsProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="p-6 border-2 border-primary/20 shadow-sm">
      <div className="space-y-4">
        <div className="border-b border-primary/10 pb-4">
          <h3 className="font-playfair text-2xl text-primary mb-2">Comments</h3>
          <p className="text-muted-foreground text-sm">
            Let everyone know what you think or ask any questions
          </p>
        </div>
        <CommentList applicationId={applicationId} showExisting={showComments} />
        <div className="border-t border-primary/10 pt-4">
          <Button 
            variant="link" 
            onClick={() => setShowComments(!showComments)}
            className="p-0 h-auto font-playfair text-primary flex items-center gap-2 hover:text-primary/80"
          >
            <MessageCircle className="h-5 w-5" />
            {showComments ? 'Hide comments' : 'Show comments'}
          </Button>
        </div>
      </div>
    </Card>
  );
};