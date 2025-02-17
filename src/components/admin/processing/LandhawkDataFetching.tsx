import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const LandhawkDataFetching = () => {
  const { toast } = useToast();
  const [isFetchingLandhawk, setIsFetchingLandhawk] = useState(false);

  const handleFetchLandhawkData = async () => {
    try {
      setIsFetchingLandhawk(true);
      toast({
        title: "Fetching from Landhawk API...",
        description: "This may take a few minutes",
      });

      const { data, error } = await supabase.functions.invoke('fetch-landhawk-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (error) {
        console.error('Error from Landhawk edge function:', error);
        throw error;
      }

      console.log('Landhawk edge function response:', data);

      toast({
        title: "Success!",
        description: data?.message || "Successfully fetched data from Landhawk API",
      });
    } catch (error: any) {
      console.error('Error fetching from Landhawk:', error);
      toast({
        title: "Error",
        description: "Failed to fetch from Landhawk API. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingLandhawk(false);
    }
  };

  return (
    <Button 
      onClick={handleFetchLandhawkData}
      className="w-full sm:w-auto"
      disabled={isFetchingLandhawk}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingLandhawk ? 'animate-spin' : ''}`} />
      {isFetchingLandhawk ? 'Fetching...' : 'Fetch From Landhawk API'}
    </Button>
  );
};