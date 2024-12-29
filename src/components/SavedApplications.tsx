import { useEffect, useState } from 'react';
import { Application } from '@/types/planning';
import { useSavedApplications } from '@/hooks/use-saved-applications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from './saved/EmptyState';
import { SavedApplicationsList } from './saved/SavedApplicationsList';

interface SavedApplicationsProps {
  applications: Application[];
  onSelectApplication: (id: number) => void;
}

export const SavedApplications = ({ applications, onSelectApplication }: SavedApplicationsProps) => {
  const { savedApplications, toggleSavedApplication } = useSavedApplications();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedApplicationsList, setSavedApplicationsList] = useState<Application[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchSavedApplications();
  }, [savedApplications]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const fetchSavedApplications = async () => {
    if (!isAuthenticated || savedApplications.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('id', savedApplications);

      if (error) throw error;

      // Transform the data to match the Application type
      const transformedData = data?.map(app => ({
        id: app.id,
        title: app.title,
        address: app.address || '',
        status: app.status || '',
        distance: 'N/A', // This might need to be calculated
        reference: app.external_id || '',
        description: app.description || '',
        applicant: app.applicant || '',
        submissionDate: app.submission_date || '',
        decisionDue: app.decision_due || '',
        type: app.type || '',
        ward: app.ward || '',
        officer: app.officer || '',
        consultationEnd: app.consultation_end || '',
        image: '/placeholder.svg' // Using absolute path from public directory
      }));

      setSavedApplicationsList(transformedData || []);
    } catch (error) {
      console.error('Error fetching saved applications:', error);
    }
  };

  const handleRemove = (id: number) => {
    toggleSavedApplication(id);
    toast({
      title: "Application removed",
      description: "The application has been removed from your saved list",
    });
  };

  if (!isAuthenticated || savedApplicationsList.length === 0) {
    return <EmptyState isAuthenticated={isAuthenticated} />;
  }

  return (
    <SavedApplicationsList
      applications={savedApplicationsList}
      onSelectApplication={onSelectApplication}
      onRemove={handleRemove}
    />
  );
};