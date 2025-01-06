import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  applicationId: number;
  parentId?: number;
  onSubmit?: () => void;
}

export const CommentForm = ({ applicationId, parentId, onSubmit }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from('Comments').insert({
        comment: comment.trim(),
        application_id: applicationId,
        parent_id: parentId,
        user_id: session.user.id,
        user_email: session.user.email
      });

      if (error) throw error;

      setComment('');
      if (onSubmit) onSubmit();
      
      toast({
        title: "Comment submitted",
        description: "Your comment has been posted successfully"
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[100px]"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || !comment.trim()}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Comment'
        )}
      </Button>
    </form>
  );
};