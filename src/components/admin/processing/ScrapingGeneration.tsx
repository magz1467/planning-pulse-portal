import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export const ScrapingGeneration = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScrapeDocuments = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      toast({
        title: "Processing documents...",
        description: "Scraping PDF URLs from document pages",
      });

      // Add retry logic for the function call
      let retries = 3;
      let data;
      let error;

      while (retries > 0) {
        try {
          const result = await supabase.functions.invoke('extract-pdf-urls', {
            method: 'POST',
            body: { timestamp: new Date().toISOString() }
          });
          
          data = result.data;
          error = result.error;
          
          if (error) throw error;
          break;
        } catch (e) {
          console.warn(`Attempt ${4-retries} failed:`, e);
          retries--;
          if (retries === 0) throw e;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log('PDF URL extraction response:', data);

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
      console.error('Error scraping documents:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to scrape documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">PDF URL Scraping</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleScrapeDocuments}
          className="w-full sm:w-auto"
          disabled={isProcessing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          {isProcessing ? 'Processing...' : 'Scrape PDF URLs'}
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