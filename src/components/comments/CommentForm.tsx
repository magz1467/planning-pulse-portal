import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('Comments')
        .insert({
          comment: comment.trim(),
          application_id: applicationId,
          user_id: session.session.user.id,
          parent_id: parentId || null
        });

      if (error) throw error;

      setComment('');
      toast({
        title: "Comment submitted",
        description: "Your comment has been posted successfully"
      });
      
      onSubmit?.();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "There was an error posting your comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  );
};