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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manual Processing</h2>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Landhawk Data</h3>
        <Button 
          onClick={handleFetchLandhawkData}
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Fetching...' : 'Fetch Landhawk Data'}
        </Button>
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