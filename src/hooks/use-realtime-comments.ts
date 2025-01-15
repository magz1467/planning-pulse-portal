import { useState, useCallback, useEffect } from 'react';
import { useWebSocketConnection } from './use-websocket-connection';

interface Comment {
  id: number;
  created_at: string;
  comment: string;
  user_id: string;
  application_id: number;
  parent_id?: number;
  upvotes: number;
  downvotes: number;
  user_email?: string;
}

export const useRealtimeComments = (applicationId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleNewComment = useCallback((payload: { 
    new: Comment;
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  }) => {
    console.log('Received new comment:', payload);
    
    if (payload.eventType === 'INSERT') {
      setComments(prev => [...prev, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      setComments(prev => 
        prev.map(comment => 
          comment.id === payload.new.id ? payload.new : comment
        )
      );
    } else if (payload.eventType === 'DELETE') {
      setComments(prev => 
        prev.filter(comment => comment.id !== payload.new.id)
      );
    }
  }, []);

  const channel = useWebSocketConnection({
    channelName: `comments-${applicationId}`,
    eventConfig: {
      event: 'INSERT',
      schema: 'public',
      table: 'comments',
      filter: `application_id=eq.${applicationId}`
    },
    callback: handleNewComment
  });

  useEffect(() => {
    const fetchExistingComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchExistingComments();
  }, [applicationId]);

  return comments;
};