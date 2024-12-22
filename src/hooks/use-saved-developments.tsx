import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Application } from '@/types/planning';

export const useSavedDevelopments = () => {
  const [savedDevelopments, setSavedDevelopments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedDevelopments();
  }, []);

  const fetchSavedDevelopments = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_developments')
        .select('application_id');

      if (error) throw error;

      setSavedDevelopments(data.map(item => item.application_id));
    } catch (error) {
      console.error('Error fetching saved developments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved developments",
        variant: "destructive",
      });
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
        await supabase
          .from('saved_developments')
          .delete()
          .eq('application_id', applicationId)
          .eq('user_id', session.user.id);

        setSavedDevelopments(prev => prev.filter(id => id !== applicationId));
      } else {
        await supabase
          .from('saved_developments')
          .insert({
            application_id: applicationId,
            user_id: session.user.id
          });

        setSavedDevelopments(prev => [...prev, applicationId]);
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

  // Mock data for demonstration
  const dummyApplications: Application[] = [
    {
      id: 1,
      title: "New Residential Complex",
      status: "Under Review",
      address: "123 Main St",
      distance: "0.2 miles",
      image: "/lovable-uploads/00c352b2-8697-4425-a649-17b25f1c6db3.png",
      reference: "REF001",
      description: "A new residential development with modern amenities",
      applicant: "ABC Developers",
      submissionDate: "2024-01-15",
      decisionDue: "2024-03-15",
      type: "Residential",
      ward: "Central",
      officer: "John Smith",
      consultationEnd: "2024-02-15"
    },
    {
      id: 2,
      title: "Commercial Development",
      status: "Approved",
      address: "456 Oak Ave",
      distance: "0.5 miles",
      image: "/lovable-uploads/128f63aa-cbd2-4d3a-89df-cd2651e10113.png",
      reference: "REF002",
      description: "Modern office space with retail units",
      applicant: "XYZ Commercial",
      submissionDate: "2024-01-10",
      decisionDue: "2024-03-10",
      type: "Commercial",
      ward: "Business District",
      officer: "Jane Doe",
      consultationEnd: "2024-02-10"
    }
  ];

  return {
    savedDevelopments,
    isLoading,
    toggleSavedDevelopment,
    dummyApplications,
  };
};