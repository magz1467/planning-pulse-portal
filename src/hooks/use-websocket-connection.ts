import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EventConfig {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  filter?: string;
}

interface WebSocketConfig {
  channelName: string;
  eventConfig: EventConfig;
  callback: (payload: any) => void;
}

export const useWebSocketConnection = ({
  channelName,
  eventConfig,
  callback
}: WebSocketConfig) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const MAX_RETRIES = 3;

  useEffect(() => {
    const setupWebSocket = () => {
      console.log('Setting up WebSocket connection...', {
        channelName,
        eventConfig
      });

      try {
        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: eventConfig.event,
              schema: eventConfig.schema,
              table: eventConfig.table,
              filter: eventConfig.filter
            },
            callback
          )
          .subscribe((status) => {
            console.log(`Subscription status for ${channelName}:`, status);

            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to channel:', channelName);
              setRetryCount(0); // Reset retry count on successful connection
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              console.error('Channel closed or error occurred:', status);
              handleReconnect();
            }
          });

        setChannel(channel);
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        handleReconnect();
      }
    };

    const handleReconnect = () => {
      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`Attempting reconnection in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setupWebSocket();
        }, delay);
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to establish real-time connection. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    setupWebSocket();

    return () => {
      if (channel) {
        console.log('Cleaning up WebSocket connection:', channelName);
        channel.unsubscribe();
      }
    };
  }, [channelName, callback, retryCount]);

  return channel;
};