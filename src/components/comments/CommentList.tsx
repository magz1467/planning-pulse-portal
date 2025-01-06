import { Comment } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
import { CommentItem } from './CommentItem';
import { useToast } from '@/hooks/use-toast';
import { useComments } from './hooks/useComments';
import { useRealtimeComments } from './hooks/useRealtimeComments';

interface CommentListProps {
  applicationId: number;
}

export const CommentList = ({ applicationId }: CommentListProps) => {
  const { comments, currentUserId, setComments } = useComments(applicationId);
  const { toast } = useToast();

  // Set up realtime subscription
  useRealtimeComments(applicationId, currentUserId, setComments);

  const handleDeleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from('Comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "There was an error deleting your comment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          applicationId={applicationId}
          currentUserId={currentUserId}
          onDelete={handleDeleteComment}
        />
      ))}
    </div>
  );
};