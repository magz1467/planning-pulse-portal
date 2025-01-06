import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/planning';

export const useRealtimeComments = (initialComments: Comment[]) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  useEffect(() => {
    const channel = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          console.log('New comment received:', payload);
          setComments((prevComments: Comment[]) => [...prevComments, payload.new as Comment]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          console.log('Comment deleted:', payload);
          setComments((prevComments: Comment[]) => 
            prevComments.filter(comment => comment.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return comments;
};