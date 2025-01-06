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
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        setCurrentUserId(session.session.user.id);
      }

      const { data, error } = await supabase
        .from('Comments')
        .select(`
          id,
          created_at,
          comment,
          user_id,
          application_id,
          parent_id,
          upvotes,
          downvotes,
          user_email
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

      // Transform the data to match the Comment type
      const transformedComments: Comment[] = data.map(comment => ({
        id: comment.id,
        created_at: comment.created_at,
        comment: comment.comment || '',
        user_id: comment.user_id || '',
        application_id: comment.application_id || 0,
        parent_id: comment.parent_id,
        upvotes: comment.upvotes || 0,
        downvotes: comment.downvotes || 0,
        user: {
          email: comment.user_email || 'Unknown User'
        }
      }));

      setComments(transformedComments);
    };

    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Comments',
          filter: `application_id=eq.${applicationId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId, toast]);

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

  // Organize comments into threads
  const threadedComments = comments.reduce((acc, comment) => {
    if (!comment.parent_id) {
      const replies = comments.filter(c => c.parent_id === comment.id);
      acc.push({
        ...comment,
        replies
      });
    }
    return acc;
  }, [] as (Comment & { replies: Comment[] })[]);

  return (
    <div className="space-y-4">
      {threadedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          applicationId={applicationId}
          replies={comment.replies}
          currentUserId={currentUserId}
          onDelete={handleDeleteComment}
        />
      ))}
    </div>
  );
};