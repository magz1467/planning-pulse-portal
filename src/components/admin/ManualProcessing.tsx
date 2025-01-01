import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [isGeneratingMaps, setIsGeneratingMaps] = useState(false);
  const batchSizes = [50, 100, 250, 500];

  const handleGenerateMaps = async () => {
    try {
      setIsGeneratingMaps(true);
      toast({
        title: "Generating static maps",
        description: "This may take a few minutes for up to 100 applications",
      });

      const response = await fetch('https://jposqxdboetyioymfswd.supabase.co/functions/v1/generate-static-maps-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();
      
      toast({
        title: "Success!",
        description: `Generated ${data.success} static maps. ${data.errors} failed.`,
      });

    } catch (error) {
      console.error('Error generating maps:', error);
      toast({
        title: "Error",
        description: "Failed to generate static maps. Please try again.",
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
      
      <div>
        <Button
          onClick={handleGenerateMaps}
          className="w-full md:w-auto"
          disabled={isGeneratingMaps}
        >
          {isGeneratingMaps ? "Generating Maps..." : "Generate Static Maps"}
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Click to generate static map images for applications that don't have them yet (processes up to 100 at a time).
        </p>
      </div>
    </div>
  );
}