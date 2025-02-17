import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export const PdfRehosting = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRehostPdfs = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      toast({
        title: "Processing PDFs...",
        description: "Rehosting PDF files to Supabase storage",
      });

      const { data, error } = await supabase.functions.invoke('rehost-pdfs', {
        method: 'POST',
        body: {
          limit: 10 // Process 10 records at a time
        }
      });
      
      if (error) {
        console.error('Error from rehost-pdfs function:', error);
        throw error;
      }

      console.log('PDF rehosting response:', data);

      if (!data || data.processed === 0) {
        toast({
          title: "No records to process",
          description: "All PDFs have been rehosted",
        });
        return;
      }

      setProgress(100);
      toast({
        title: "Success!",
        description: `${data.message}`,
      });
    } catch (error: any) {
      console.error('Error rehosting PDFs:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to rehost PDFs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">PDF Rehosting</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleRehostPdfs}
          className="w-full sm:w-auto"
          disabled={isProcessing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Processing...' : 'Rehost PDFs'}
        </Button>
      </div>
      
      {isProcessing && (
        <Progress 
          value={progress} 
          className="h-2" 
        />
      )}
    </div>
  );
};