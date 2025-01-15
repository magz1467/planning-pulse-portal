import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useRealtimeComments = (applicationId: number) => {
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const setupRealtimeSubscription = () => {
      if (retryCount >= MAX_RETRIES) {
        console.warn('Max WebSocket connection retries reached');
        toast({
          title: "Connection Error",
          description: "Unable to establish realtime connection. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      console.log('Setting up realtime subscription for application:', applicationId);

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
          console.log('Subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setRetryCount(0); // Reset retry count on successful connection
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Channel connection error:', status);
            setIsConnected(false);
            setRetryCount(prev => prev + 1);
            
            // Attempt reconnection with exponential backoff
            const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
            retryTimeout = setTimeout(() => {
              console.log('Attempting to reconnect...');
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
  }, [applicationId, retryCount]);

  return { isConnected };
};