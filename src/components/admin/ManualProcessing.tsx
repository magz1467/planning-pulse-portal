import { Separator } from "@/components/ui/separator";
import { TitleGeneration } from "./processing/TitleGeneration";
import { MapGeneration } from "./processing/MapGeneration";
import { ImpactScoreGeneration } from "./processing/ImpactScoreGeneration";
import { OnlineDescriptionGeneration } from "./processing/OnlineDescriptionGeneration";
import { ScrapingGeneration } from "./processing/ScrapingGeneration";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ManualProcessingProps {
  isGenerating: boolean;
  processingBatchSize: number | null;
  onGenerate: (batchSize: number) => void;
}

export const ManualProcessing = ({ 
  isGenerating, 
  processingBatchSize, 
  onGenerate 
}: ManualProcessingProps) => {
  const batchSizes = [50, 100, 250, 500];
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching500, setIsFetching500] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [isFetchingLandhawk, setIsFetchingLandhawk] = useState(false);

  const handleFetchLandhawkData = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Fetching Landhawk data...",
        description: "This may take a few minutes",
      });

      const { data, error } = await supabase.functions.invoke('fetch-trial-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      console.log('Edge function response:', data);

      toast({
        title: "Success!",
        description: data?.message || "Landhawk data has been fetched and stored",
      });
    } catch (error: any) {
      console.error('Error fetching Landhawk data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Landhawk data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFetchFromLandhawk = async () => {
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manual Processing</h2>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Landhawk Data</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleFetchLandhawkData}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Fetching...' : 'Fetch Trial Data'}
          </Button>
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
          <Button 
            onClick={handleFetchFromLandhawk}
            className="w-full sm:w-auto"
            disabled={isFetchingLandhawk}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingLandhawk ? 'animate-spin' : ''}`} />
            {isFetchingLandhawk ? 'Fetching...' : 'Fetch From Landhawk API'}
          </Button>
        </div>
      </div>

      <Separator className="my-6" />
      
      <TitleGeneration 
        isGenerating={isGenerating}
        processingBatchSize={processingBatchSize}
        onGenerate={onGenerate}
        batchSizes={batchSizes}
      />

      <Separator className="my-6" />
      
      <MapGeneration />

      <Separator className="my-6" />

      <ImpactScoreGeneration />

      <Separator className="my-6" />

      <OnlineDescriptionGeneration />

      <Separator className="my-6" />
      
      <ScrapingGeneration />
    </div>
  );
};
