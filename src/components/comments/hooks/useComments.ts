import { useState, useEffect } from 'react';
import { Comment } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';

export const useComments = (applicationId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user?.id) {
          setCurrentUserId(session.session.user.id);
        }

        const { data, error } = await supabase
          .from('Comments')
          .select('*')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching comments:', error);
          setError(error.message);
          return;
        }

        setComments(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [applicationId]);

  return {
    comments,
    currentUserId,
    setComments,
    isLoading,
    error
  };
};