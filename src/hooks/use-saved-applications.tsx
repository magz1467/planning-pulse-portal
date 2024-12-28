import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SavedApplication } from '@/types/saved';

// Dummy data for development
const dummyApplications = [
  {
    id: 1,
    title: "Application 1",
    address: "123 Main St",
    status: "Pending",
    distance: "1.2 miles",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    title: "Application 2",
    address: "456 Elm St",
    status: "Approved",
    distance: "0.5 miles",
    image: "https://via.placeholder.com/150"
  },
];

export const useSavedApplications = () => {
  const [savedApplications, setSavedApplications] = useState<number[]>([]);
  const { toast } = useToast();

  const fetchSavedApplications = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        return;
      }

      const { data, error } = await supabase
        .from('saved_applications')
        .select('application_id')
        .eq('user_id', session.session.user.id);

      if (error) {
        throw error;
      }

      setSavedApplications(data.map(item => item.application_id));
    } catch (error: any) {
      console.error('Error fetching saved applications:', error);
      toast({
        title: "Error",
        description: "Failed to load saved applications",
        variant: "destructive",
      });
    }
  };

  const toggleSavedApplication = async (applicationId: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        return;
      }

      const isSaved = savedApplications.includes(applicationId);

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_applications')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('application_id', applicationId);

        if (error) throw error;

        setSavedApplications(prev => prev.filter(id => id !== applicationId));
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_applications')
          .insert({
            user_id: session.session.user.id,
            application_id: applicationId
          });

        if (error) throw error;

        setSavedApplications(prev => [...prev, applicationId]);
      }
    } catch (error: any) {
      console.error('Error toggling saved application:', error);
      toast({
        title: "Error",
        description: "Failed to update saved applications",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSavedApplications();
  }, []);

  return {
    savedApplications,
    toggleSavedApplication,
    dummyApplications
  };
};