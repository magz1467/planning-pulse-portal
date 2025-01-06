import { useEffect, useState } from 'react';
import { Comment } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
import { CommentItem } from './CommentItem';
import { useToast } from '@/hooks/use-toast';

interface CommentListProps {
  applicationId: number;
}

export const CommentList = ({ applicationId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          setCurrentUserId(session.session.user.id);
        }

        const { data, error } = await supabase
          .from('Comments')
          .select(`
            *,
            profiles (
              username
            )
          `)
          .eq('application_id', applicationId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching comments:', error);
          toast({
            title: "Error",
            description: "Failed to load comments",
            variant: "destructive"
          });
          return;
        }

        setComments(data as Comment[]);
      } catch (error) {
        console.error('Error in fetchComments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive"
        });
      }
    };

    fetchComments();

    const channel = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Comments',
          filter: `application_id=eq.${applicationId}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newComment = payload.new as Comment;
            setComments(prevComments => [newComment, ...prevComments]);
            
            if (newComment.user_id !== currentUserId) {
              toast({
                title: "New Comment",
                description: "Someone just added a new comment"
              });
            }
          } else if (payload.eventType === 'DELETE') {
            setComments(prevComments => 
              prevComments.filter(c => c.id !== (payload.old as Comment).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId, toast, currentUserId]);

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