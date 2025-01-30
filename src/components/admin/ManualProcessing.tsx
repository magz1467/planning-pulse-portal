import { Separator } from "@/components/ui/separator";
import { TitleGeneration } from "./processing/TitleGeneration";
import { MapGeneration } from "./processing/MapGeneration";
import { ImpactScoreGeneration } from "./processing/ImpactScoreGeneration";
import { OnlineDescriptionGeneration } from "./processing/OnlineDescriptionGeneration";
import { ScrapingGeneration } from "./processing/ScrapingGeneration";
import { LandhawkDataFetching } from "./processing/LandhawkDataFetching";
import { TrialDataFetching } from "./processing/TrialDataFetching";
import { DocumentProcessing } from "./processing/DocumentProcessing";

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
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Data Management</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <LandhawkDataFetching />
          <TrialDataFetching />
          <DocumentProcessing />
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