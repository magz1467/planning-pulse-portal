import { Separator } from "@/components/ui/separator";
import { TitleGeneration } from "./processing/TitleGeneration";
import { MapGeneration } from "./processing/MapGeneration";
import { ImpactScoreGeneration } from "./processing/ImpactScoreGeneration";
import { OnlineDescriptionGeneration } from "./processing/OnlineDescriptionGeneration";
import { ScrapingGeneration } from "./processing/ScrapingGeneration";

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manual Processing</h2>
      
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