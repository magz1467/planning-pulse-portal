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
        .in('application_id', savedApplications);

      if (error) throw error;

      // Transform the data to match the Application type
      const transformedData = data?.map(app => {
        // Extract coordinates from PostGIS geometry
        const geomText = app.geom as string;
        const match = geomText?.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        const coordinates = match ? [parseFloat(match[2]), parseFloat(match[1])] as [number, number] : [0, 0];

        return {
          id: app.application_id,
          title: app.description || '', // Using description as title since there's no direct title field
          address: `${app.site_name || ''} ${app.street_name || ''} ${app.locality || ''} ${app.postcode || ''}`.trim(),
          status: app.status || '',
          distance: 'N/A',
          reference: app.lpa_app_no || '',
          description: app.description || '',
          applicant: typeof app.application_details === 'object' ? 
            (app.application_details as any)?.applicant || '' : '',
          submissionDate: app.valid_date || '',
          decisionDue: app.decision_target_date || '',
          type: app.application_type || '',
          ward: app.ward || '',
          officer: typeof app.application_details === 'object' ? 
            (app.application_details as any)?.officer || '' : '',
          consultationEnd: app.last_date_consultation_comments || '',
          image: '/placeholder.svg',
          coordinates
        };
      });

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