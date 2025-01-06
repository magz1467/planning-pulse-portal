import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from '@/types/planning';

interface CommentFormProps {
  applicationId: number;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export const CommentForm = ({
  applicationId,
  setComments
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) return;

    try {
      const { data, error } = await supabase
        .from('Comments')
        .insert([{ application_id: applicationId, comment: content }])
        .select();

      if (error) {
        console.error('Error submitting comment:', error);
        toast({
          title: "Error",
          description: "Failed to submit comment",
          variant: "destructive",
        });
        return;
      }

      setComments(prev => [...prev, ...(data || [])]);
      setContent('');
      toast({
        title: "Comment submitted",
        description: "Your comment has been added",
      });
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={3}
        required
      />
      <Button type="submit">Submit Comment</Button>
    </form>
  );
};