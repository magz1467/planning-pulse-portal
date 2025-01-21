import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface ApplicationError {
  message: string;
  details?: string;
}

export const useApplicationError = () => {
  const [error, setError] = useState<ApplicationError | null>(null);

  const handleError = (error: any, customMessage?: string) => {
    console.error('❌ Failed to fetch applications:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });

    const errorMessage = error.message === "canceling statement due to statement timeout"
      ? "The search took too long. Please try a smaller radius or different location."
      : error.message;

    setError({
      message: customMessage || 'Failed to fetch applications',
      details: errorMessage
    });

    toast({
      title: "Error loading applications",
      description: errorMessage || "Please try again later",
      variant: "destructive"
    });
  };

  return {
    error,
    setError,
    handleError
  };
};