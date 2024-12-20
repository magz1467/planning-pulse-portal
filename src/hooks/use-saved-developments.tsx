import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Dummy data for demonstration
const dummyApplications = [
  { id: 1, title: "New Residential Complex", status: "Under Review", address: "123 Main St", distance: "0.2 miles", image: "/lovable-uploads/00c352b2-8697-4425-a649-17b25f1c6db3.png" },
  { id: 2, title: "Commercial Development", status: "Approved", address: "456 Oak Ave", distance: "0.5 miles", image: "/lovable-uploads/128f63aa-cbd2-4d3a-89df-cd2651e10113.png" },
  { id: 3, title: "Community Center", status: "Under Review", address: "789 Pine Rd", distance: "0.8 miles", image: "/lovable-uploads/2a1a1b3d-4e95-4458-a340-d34de8863e11.png" },
  { id: 4, title: "Mixed-Use Development", status: "Pending", address: "321 Elm St", distance: "1.2 miles", image: "/lovable-uploads/5138b4f3-8820-4457-9664-4a7f54b617a9.png" },
  { id: 5, title: "Retail Complex", status: "Approved", address: "654 Maple Dr", distance: "1.5 miles", image: "/lovable-uploads/6492526a-800c-4702-a7f5-544d42447cc7.png" },
];

export const useSavedDevelopments = () => {
  const [savedDevelopments, setSavedDevelopments] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        setSavedDevelopments(prev => prev.filter(id => id !== applicationId));
      } else {
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

  return {
    savedDevelopments,
    isLoading,
    toggleSavedDevelopment,
    dummyApplications,
  };
};