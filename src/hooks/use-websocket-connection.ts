import { useEffect, useRef, useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface WebSocketConfig {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  filter?: string;
}

export const useWebSocketConnection = (config: WebSocketConfig, onMessage: (payload: any) => void) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Clean up existing connection if any
        if (channelRef.current) {
          channelRef.current.unsubscribe();
        }

        // Create new subscription
        channelRef.current = supabase
          .channel('db-changes')
          .on(
            'postgres_changes' as any,
            {
              event: config.event,
              schema: config.schema,
              table: config.table,
              filter: config.filter
            },
            (payload) => {
              console.log('Received WebSocket message:', payload);
              onMessage(payload);
            }
          )
          .subscribe((status) => {
            console.log('WebSocket connection status:', status);
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              // Clear retry timeout if connection successful
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = undefined;
              }
            } else {
              setIsConnected(false);
            }
          });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to real-time updates. Retrying...',
          variant: 'destructive'
        });

        // Retry connection with exponential backoff
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [config.event, config.schema, config.table, config.filter, toast, onMessage]);

  return { isConnected };
};