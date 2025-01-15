import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useErrorHandling = (
  isLoading: boolean,
  applicationsCount: number,
  hasCoordinates: boolean
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && applicationsCount === 0 && hasCoordinates) {
      toast({
        title: "No applications found",
        description: "Try adjusting your search area or filters",
        variant: "destructive",
      });
    }
  }, [isLoading, applicationsCount, hasCoordinates, toast]);
};