import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/planning';

export const useRealtimeComments = (applicationId: number) => {
  const subscribeToComments = () => {
    console.log('Subscribing to comments for application:', applicationId);
    
    const channel = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `application_id=eq.${applicationId}`
        },
        (payload) => {
          console.log('New comment received:', payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `application_id=eq.${applicationId}`
        },
        (payload) => {
          console.log('Comment deleted:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return { subscribeToComments };
};