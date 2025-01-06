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
  const [isGeneratingScores, setIsGeneratingScores] = useState(false);
  const [mapBatchSize, setMapBatchSize] = useState(100);
  const [scoreBatchSize, setScoreBatchSize] = useState(50);
  const batchSizes = [50, 100, 250, 500];

  const handleGenerateScores = async () => {
    try {
      setIsGeneratingScores(true);
      console.log('[Impact Scores] Starting generation process...');
      
      toast({
        title: "Generating impact scores",
        description: `This may take a few minutes for up to ${scoreBatchSize} applications`,
      });

      console.log('[Impact Scores] Invoking edge function with batch size:', scoreBatchSize);
      const { data, error } = await supabase.functions.invoke('generate-impact-scores', {
        body: { limit: scoreBatchSize }
      });

      if (error) {
        console.error('[Impact Scores] Error response from edge function:', error);
        throw new Error(`Failed to generate scores: ${error.message}`);
      }

      console.log('[Impact Scores] Generation result:', data);
      
      // Query the database to verify results
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .not('impact_score', 'is', null);
      
      console.log('[Impact Scores] Total applications with impact scores:', count);

      // Query recently processed applications
      const { data: recentScores } = await supabase
        .from('applications')
        .select('application_id, impact_score, impact_score_details')
        .not('impact_score', 'is', null)
        .order('application_id', { ascending: false })
        .limit(5);

      console.log('[Impact Scores] Recent scores generated:', recentScores);
      
      toast({
        title: "Success!",
        description: `${data.message}. Total applications with impact scores: ${count}`,
      });

    } catch (error) {
      console.error('[Impact Scores] Error generating scores:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate impact scores. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingScores(false);
    }
  };

  const handleGenerateMaps = async () => {
    try {
      setIsGeneratingMaps(true);
      console.log('Starting map generation process...');
      
      toast({
        title: "Generating static maps",
        description: `This may take a few minutes for up to ${mapBatchSize} applications`,
      });

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

      <Separator className="my-6" />

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={() => {
              setScoreBatchSize(50);
              handleGenerateScores();
            }}
            className="flex-1 md:flex-none"
            disabled={isGeneratingScores}
          >
            {isGeneratingScores && scoreBatchSize === 50 ? "Generating Scores..." : "Generate 50 Impact Scores"}
          </Button>

          <Button
            onClick={() => {
              setScoreBatchSize(100);
              handleGenerateScores();
            }}
            className="flex-1 md:flex-none"
            disabled={isGeneratingScores}
            variant="secondary"
          >
            {isGeneratingScores && scoreBatchSize === 100 ? "Generating Scores..." : "Generate 100 Impact Scores"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Click to generate environmental impact scores for applications that don't have them yet. Choose between processing 50 or 100 applications at a time.
        </p>
      </div>
    </div>
  );
}