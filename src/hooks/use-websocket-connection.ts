import { useState, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseWebSocketConnectionProps {
  channelName: string;
  eventConfig: {
    event: string;
    schema: string;
    table: string;
    filter?: string;
  };
  onMessage: (payload: any) => void;
}

export const useWebSocketConnection = ({ 
  channelName, 
  eventConfig, 
  onMessage 
}: UseWebSocketConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const MAX_RETRIES = 3;

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    let channel: RealtimeChannel;

    const setupConnection = () => {
      if (retryCount >= MAX_RETRIES) {
        console.warn('Max WebSocket connection retries reached');
        toast({
          title: "Connection Error",
          description: "Unable to establish realtime connection. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      console.log('Setting up WebSocket connection for channel:', channelName);

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: eventConfig.event,
            schema: eventConfig.schema,
            table: eventConfig.table,
            filter: eventConfig.filter,
          },
          onMessage
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            setRetryCount(0);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.error('Channel connection error:', status);
            setIsConnected(false);
            setRetryCount(prev => prev + 1);
            
            const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
            retryTimeout = setTimeout(() => {
              console.log('Attempting to reconnect...');
              setupConnection();
            }, backoffTime);
          }
        });

      return () => {
        clearTimeout(retryTimeout);
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    };

    const cleanup = setupConnection();

    return () => {
      if (cleanup) cleanup();
    };
  }, [channelName, eventConfig, onMessage, retryCount, toast]);

  return { isConnected };
};