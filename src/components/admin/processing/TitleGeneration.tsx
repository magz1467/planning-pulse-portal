import { Button } from "@/components/ui/button";

interface TitleGenerationProps {
  isGenerating: boolean;
  processingBatchSize: number | null;
  onGenerate: (batchSize: number) => void;
  batchSizes: number[];
}

export const TitleGeneration = ({ 
  isGenerating, 
  processingBatchSize, 
  onGenerate,
  batchSizes 
}: TitleGenerationProps) => {
  return (
    <>
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
    </>
  );
};