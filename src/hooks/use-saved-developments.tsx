import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSavedDevelopments = () => {
  const [savedDevelopments, setSavedDevelopments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedDevelopments();
  }, []);

  const fetchSavedDevelopments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('saved_developments')
        .select('application_id');

      if (error) throw error;

      setSavedDevelopments(data.map(item => item.application_id));
    } catch (error) {
      console.error('Error fetching saved developments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSavedDevelopment = async (applicationId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save developments",
          variant: "destructive",
        });
        return;
      }

      const isSaved = savedDevelopments.includes(applicationId);

      if (isSaved) {
        const { error } = await supabase
          .from('saved_developments')
          .delete()
          .eq('application_id', applicationId)
          .eq('user_id', session.user.id);

        if (error) throw error;

        setSavedDevelopments(prev => prev.filter(id => id !== applicationId));
        toast({
          title: "Development removed",
          description: "Development has been removed from your saved list",
        });
      } else {
        const { error } = await supabase
          .from('saved_developments')
          .insert([
            {
              application_id: applicationId,
              user_id: session.user.id,
            },
          ]);

        if (error) throw error;

        setSavedDevelopments(prev => [...prev, applicationId]);
        toast({
          title: "Development saved",
          description: "Development has been added to your saved list",
        });
      }
    } catch (error) {
      console.error('Error toggling saved development:', error);
      toast({
        title: "Error",
        description: "Failed to update saved developments",
        variant: "destructive",
      });
    }
  };

  return {
    savedDevelopments,
    isLoading,
    toggleSavedDevelopment,
  };
};