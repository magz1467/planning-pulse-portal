import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useRealtimeComments = (applicationId: number) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout: NodeJS.Timeout;

    const setupRealtimeSubscription = () => {
      if (retryCount >= maxRetries) {
        console.warn('Max WebSocket connection retries reached');
        return;
      }

      const channel = supabase
        .channel(`comments-${applicationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Comments',
            filter: `application_id=eq.${applicationId}`
          },
          (payload) => {
            console.log('Comment change received:', payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            retryCount = 0; // Reset retry count on successful connection
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            retryCount++;
            
            // Attempt reconnection with exponential backoff
            const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
            retryTimeout = setTimeout(() => {
              setupRealtimeSubscription();
            }, backoffTime);
          }
        });

      return () => {
        clearTimeout(retryTimeout);
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtimeSubscription();
    return () => {
      if (cleanup) cleanup();
    };
  }, [applicationId]);

  return { isConnected };
};