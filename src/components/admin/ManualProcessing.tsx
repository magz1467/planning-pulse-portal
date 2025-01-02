import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const [isGeneratingMaps, setIsGeneratingMaps] = useState(false);
  const [mapBatchSize, setMapBatchSize] = useState(100);
  const batchSizes = [50, 100, 250, 500];

  const handleGenerateMaps = async () => {
    try {
      setIsGeneratingMaps(true);
      console.log('Starting map generation process...');
      
      toast({
        title: "Generating static maps",
        description: `This may take a few minutes for up to ${mapBatchSize} applications`,
      });

      // Use supabase client to invoke the function instead of raw fetch
      const { data, error } = await supabase.functions.invoke('generate-static-maps-manual', {
        body: { batch_size: mapBatchSize }
      });

      if (error) {
        console.error('Error response:', error);
        throw new Error(`Failed to generate maps: ${error.message}`);
      }

      console.log('Generation result:', data);
      
      toast({
        title: "Success!",
        description: `Generated ${data.success} static maps. ${data.errors} failed.`,
      });

    } catch (error) {
      console.error('Error generating maps:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate static maps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMaps(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manual Processing</h2>
      
      {batchSizes.map(size => (
        <div key={size}>
          <Button 
            onClick={() => onGenerate(size)}
            className="w-full md:w-auto"
            disabled={isGenerating}
            variant={processingBatchSize === size ? "secondary" : "default"}
          >
            {processingBatchSize === size ? "Processing..." : `Generate ${size} AI Titles`}
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            Click to generate AI titles for up to {size} applications that don't have titles yet.
          </p>
        </div>
      ))}

      <Separator className="my-6" />
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setMapBatchSize(100);
              handleGenerateMaps();
            }}
            className="flex-1 md:flex-none"
            disabled={isGeneratingMaps}
          >
            {isGeneratingMaps && mapBatchSize === 100 ? "Generating Maps..." : "Generate 100 Maps"}
          </Button>

          <Button
            onClick={() => {
              setMapBatchSize(500);
              handleGenerateMaps();
            }}
            className="flex-1 md:flex-none"
            disabled={isGeneratingMaps}
            variant="secondary"
          >
            {isGeneratingMaps && mapBatchSize === 500 ? "Generating Maps..." : "Generate 500 Maps"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Click to generate static map images for applications that don't have them yet. Choose between processing 100 or 500 applications at a time.
        </p>
      </div>
    </div>
  );
}