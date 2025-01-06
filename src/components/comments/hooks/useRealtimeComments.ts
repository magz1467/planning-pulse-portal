import { useEffect } from 'react';
import { Comment } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeComments = (
  applicationId: number,
  currentUserId: string | undefined,
  setComments: (comments: Comment[]) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
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
  }, [applicationId, currentUserId, setComments, toast]);
};