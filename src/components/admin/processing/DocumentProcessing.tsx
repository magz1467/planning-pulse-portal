import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const DocumentProcessing = () => {
  const { toast } = useToast();
  const [isProcessingDocs, setIsProcessingDocs] = useState(false);

  const handleProcessDocuments = async () => {
    try {
      setIsProcessingDocs(true);
      toast({
        title: "Processing documents...",
        description: "Converting summary URLs to document URLs",
      });

      const { data, error } = await supabase.functions.invoke('documentation-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (error) {
        console.error('Error from documentation analysis function:', error);
        throw error;
      }

      console.log('Documentation analysis response:', data);

      toast({
        title: "Success!",
        description: data?.message || "Successfully processed document URLs",
      });
    } catch (error: any) {
      console.error('Error processing documents:', error);
      toast({
        title: "Error",
        description: "Failed to process documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingDocs(false);
    }
  };

  return (
    <Button 
      onClick={handleProcessDocuments}
      className="w-full sm:w-auto"
      disabled={isProcessingDocs}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isProcessingDocs ? 'animate-spin' : ''}`} />
      {isProcessingDocs ? 'Processing...' : 'Process Document URLs'}
    </Button>
  );
};