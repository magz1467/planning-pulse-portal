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
            user:user_id (
              email,
              profile:profiles (
                username
              )
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

        if (!data) {
          setComments([]);
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

    // Subscribe to real-time changes
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
            const newComment = payload.new as any;
            // Fetch the user profile for the new comment
            supabase
              .from('profiles')
              .select('username')
              .eq('id', newComment.user_id)
              .single()
              .then(({ data: profile }) => {
                const transformedComment: Comment = {
                  ...newComment,
                  user: {
                    email: newComment.user_email,
                    profile: profile
                  }
                };
                setComments(prevComments => [transformedComment, ...prevComments]);
              });
            
            // Show toast notification for new comments
            if (newComment.user_id !== currentUserId) {
              toast({
                title: "New Comment",
                description: "Someone just added a new comment"
              });
            }
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

      setComments(comments.filter(c => c.id !== commentId));
      
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