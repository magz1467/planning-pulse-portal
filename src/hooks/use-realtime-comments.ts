import { useCallback } from 'react';
import { useWebSocketConnection } from './use-websocket-connection';

export const useRealtimeComments = (applicationId: number) => {
  const handleMessage = useCallback((payload: any) => {
    console.log('Comment change received:', payload);
  }, []);

  const { isConnected } = useWebSocketConnection({
    channelName: `comments-${applicationId}`,
    eventConfig: {
      event: '*',
      schema: 'public',
      table: 'Comments',
      filter: `application_id=eq.${applicationId}`
    },
    onMessage: handleMessage
  });

  return { isConnected };
};