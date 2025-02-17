import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const TrialDataFetching = () => {
  const { toast } = useToast();
  const [isFetching500, setIsFetching500] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  const handleFetch500More = async () => {
    try {
      setIsFetching500(true);
      toast({
        title: "Fetching 500 more records...",
        description: "This may take a few minutes",
      });

      const { data, error } = await supabase.functions.invoke('fetch-trial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { limit: 500 }
      });
      
      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      console.log('Edge function response for 500 records:', data);

      toast({
        title: "Success!",
        description: "500 more records have been fetched and stored",
      });
    } catch (error: any) {
      console.error('Error fetching 500 more records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch additional records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetching500(false);
    }
  };

  const handleFetchAllAvailable = async () => {
    try {
      setIsFetchingAll(true);
      toast({
        title: "Fetching all available records...",
        description: "This may take several minutes",
      });

      const { data, error } = await supabase.functions.invoke('fetch-trial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { fetchAll: true }
      });
      
      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      console.log('Edge function response for all records:', data);

      toast({
        title: "Success!",
        description: "All available records have been fetched and stored",
      });
    } catch (error: any) {
      console.error('Error fetching all records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch all records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingAll(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleFetch500More}
        className="w-full sm:w-auto"
        disabled={isFetching500}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isFetching500 ? 'animate-spin' : ''}`} />
        {isFetching500 ? 'Fetching 500...' : 'Fetch 500 More Records'}
      </Button>
      <Button 
        onClick={handleFetchAllAvailable}
        className="w-full sm:w-auto"
        disabled={isFetchingAll}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingAll ? 'animate-spin' : ''}`} />
        {isFetchingAll ? 'Fetching All...' : 'Fetch All Available Records'}
      </Button>
    </>
  );
};