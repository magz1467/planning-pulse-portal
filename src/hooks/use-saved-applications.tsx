import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSavedApplications = () => {
  const [savedApplications, setSavedApplications] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedApplications();
  }, []);

  const fetchSavedApplications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from('saved_applications')
        .select('application_id')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching saved applications:', error);
        return;
      }

      setSavedApplications(data.map(item => Number(item.application_id)));
    } catch (error) {
      console.error('Error in fetchSavedApplications:', error);
    }
  };

  const toggleSavedApplication = async (applicationId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save applications",
          variant: "destructive"
        });
        return;
      }

      if (savedApplications.includes(applicationId)) {
        const { error } = await supabase
          .from('saved_applications')
          .delete()
          .eq('user_id', session.user.id)
          .eq('application_id', applicationId);

        if (error) throw error;

        setSavedApplications(prev => prev.filter(id => id !== applicationId));
      } else {
        const { error } = await supabase
          .from('saved_applications')
          .insert([
            { 
              user_id: session.user.id,
              application_id: applicationId
            }
          ]);

        if (error) throw error;

        setSavedApplications(prev => [...prev, applicationId]);
      }
    } catch (error) {
      console.error('Error toggling saved application:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the application. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    savedApplications,
    toggleSavedApplication
  };
};