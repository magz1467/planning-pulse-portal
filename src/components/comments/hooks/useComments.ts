import { useState, useEffect } from 'react';
import { Comment } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useComments = (applicationId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          setCurrentUserId(session.session.user.id);
        }

        const { data, error } = await supabase
          .from('Comments')
          .select('*, user:user_id (username)')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching comments:', error);
          toast({
            title: "Error",
            description: "Failed to load comments",
            variant: "destructive"
          });
          return;
        }

        setComments(data as Comment[]);
      } catch (error) {
        console.error('Error in fetchComments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [applicationId, toast]);

  return { comments, isLoading, currentUserId, setComments };
};