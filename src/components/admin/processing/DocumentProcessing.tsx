import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export const DocumentProcessing = () => {
  const { toast } = useToast();
  const [isProcessingDocs, setIsProcessingDocs] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcessDocuments = async () => {
    try {
      setIsProcessingDocs(true);
      setProgress(0);
      
      toast({
        title: "Processing documents...",
        description: "Converting summary URLs to document URLs",
      });

      const { data, error } = await supabase.functions.invoke('documentation-analysis', {
        method: 'POST',
        body: {
          limit: 10 // Process 10 records at a time
        }
      });
      
      if (error) {
        console.error('Error from documentation analysis function:', error);
        throw error;
      }

      console.log('Documentation analysis response:', data);

      if (data.processed === 0) {
        toast({
          title: "No records to process",
          description: "All records have been processed",
        });
        return;
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: `${data.message}. ${data.failed > 0 ? `Failed to process ${data.failed} records.` : ''}`,
      });
    } catch (error: any) {
      console.error('Error processing documents:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to process documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingDocs(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleProcessDocuments}
        className="w-full sm:w-auto"
        disabled={isProcessingDocs}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isProcessingDocs ? 'animate-spin' : ''}`} />
        {isProcessingDocs ? 'Processing...' : 'Process Document URLs'}
      </Button>
      
      {isProcessingDocs && (
        <Progress 
          value={progress} 
          className="h-2" 
        />
      )}
    </div>
  );
};