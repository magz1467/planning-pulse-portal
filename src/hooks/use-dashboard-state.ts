import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchLogger } from "@/hooks/use-search-logger";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardState = () => {
  const [searchParams] = useSearchParams();
  const [postcode, setPostcode] = useState<string>(
    searchParams.get("postcode") || ""
  );
  const [initialTab] = useState<string>(searchParams.get("tab") || "all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { logSearch } = useSearchLogger();

  useEffect(() => {
    if (postcode) {
      handleSearch(postcode);
    }
  }, []);

  const handleSearch = useCallback(async (searchPostcode: string) => {
    setPostcode(searchPostcode);
    setIsLoading(true);
    setError(null);
    const startTime = performance.now();
    
    try {
      const { data: applications, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('postcode', searchPostcode)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const loadTime = performance.now() - startTime;
      await logSearch({
        postcode: searchPostcode,
        status: initialTab,
        loadTime,
        source: 'DashboardState'
      });

      setIsLoading(false);
      return applications;
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch applications. Please try again.');
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      });

      return [];
    }
  }, [initialTab, toast]);

  const clearSearch = useCallback(() => {
    setPostcode("");
    setError(null);
  }, []);

  return {
    postcode,
    isLoading,
    error,
    handleSearch,
    clearSearch,
    initialTab
  };
};