import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { useToast } from '@/components/ui/use-toast';

interface SavedApplicationsContextType {
  savedApplications: number[];
  loading: boolean;
  toggleSaved: (applicationId: number) => Promise<void>;
  isSaved: (applicationId: number) => boolean;
}

const SavedApplicationsContext = createContext<SavedApplicationsContextType>({
  savedApplications: [],
  loading: true,
  toggleSaved: async () => {},
  isSaved: () => false,
});

export const useSavedApplications = () => {
  return useContext(SavedApplicationsContext);
};

export const SavedApplicationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedApplications, setSavedApplications] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedApplications();
    } else {
      setSavedApplications([]);
      setLoading(false);
    }
  }, [user]);

  const loadSavedApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_applications')
        .select('application_id')
        .eq('user_id', user?.id);

      if (error) throw error;

      setSavedApplications(data.map(item => item.application_id));
    } catch (error) {
      console.error('Error loading saved applications:', error);
      toast({
        title: "Error",
        description: "Failed to load saved applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSaved = async (applicationId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save applications",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isSaved(applicationId)) {
        const { error } = await supabase
          .from('saved_applications')
          .delete()
          .eq('user_id', user.id)
          .eq('application_id', applicationId);

        if (error) throw error;

        setSavedApplications(prev => prev.filter(id => id !== applicationId));
        toast({
          title: "Removed",
          description: "Application removed from saved list",
        });
      } else {
        const { error } = await supabase
          .from('saved_applications')
          .insert({
            user_id: user.id,
            application_id: applicationId
          });

        if (error) throw error;

        setSavedApplications(prev => [...prev, applicationId]);
        toast({
          title: "Saved",
          description: "Application added to saved list",
        });
      }
    } catch (error) {
      console.error('Error toggling saved application:', error);
      toast({
        title: "Error",
        description: "Failed to update saved applications",
        variant: "destructive",
      });
    }
  };

  const isSaved = (applicationId: number) => {
    return savedApplications.includes(applicationId);
  };

  return (
    <SavedApplicationsContext.Provider value={{ savedApplications, loading, toggleSaved, isSaved }}>
      {children}
    </SavedApplicationsContext.Provider>
  );
};