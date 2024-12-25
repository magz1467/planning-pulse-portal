import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Dummy data for development
const dummyApplications = [
  {
    id: 1,
    title: "Development 1",
    address: "123 Main St",
    status: "Pending",
    distance: "1.2 miles",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    title: "Development 2",
    address: "456 Elm St",
    status: "Approved",
    distance: "0.5 miles",
    image: "https://via.placeholder.com/150"
  },
  // Add more dummy applications as needed
];

export const useSavedDevelopments = () => {
  const [savedDevelopments, setSavedDevelopments] = useState<number[]>([]);
  const { toast } = useToast();

  const fetchSavedDevelopments = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        return;
      }

      const { data, error } = await supabase
        .from('saved_developments')
        .select('application_id')
        .eq('user_id', session.session.user.id);

      if (error) {
        throw error;
      }

      setSavedDevelopments(data.map(item => item.application_id));
    } catch (error: any) {
      console.error('Error fetching saved developments:', error);
      toast({
        title: "Error",
        description: "Failed to load saved developments",
        variant: "destructive",
      });
    }
  };

  const toggleSavedDevelopment = async (applicationId: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        return;
      }

      const isSaved = savedDevelopments.includes(applicationId);

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_developments')
          .delete()
          .eq('user_id', session.session.user.id)
          .eq('application_id', applicationId);

        if (error) throw error;

        setSavedDevelopments(prev => prev.filter(id => id !== applicationId));
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_developments')
          .insert({
            user_id: session.session.user.id,
            application_id: applicationId
          });

        if (error) throw error;

        setSavedDevelopments(prev => [...prev, applicationId]);
      }
    } catch (error: any) {
      console.error('Error toggling saved development:', error);
      toast({
        title: "Error",
        description: "Failed to update saved developments",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSavedDevelopments();
  }, []);

  return {
    savedDevelopments,
    toggleSavedDevelopment,
    dummyApplications
  };
};
