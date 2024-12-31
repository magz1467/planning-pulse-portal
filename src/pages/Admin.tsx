import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [totalLimit, setTotalLimit] = useState(1000);
  const [processedCount, setProcessedCount] = useState(0);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  
  const handleGenerateTitles = async (batchSize: number) => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      toast({
        title: "Generating titles...",
        description: `This may take a few minutes for ${batchSize} records`,
      });

      const { data, error } = await supabase.functions.invoke('generate-titles-manual', {
        body: { limit: batchSize }
      });
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: data.message || "Titles have been generated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const processBatchesContinuously = useCallback(async () => {
    if (!isContinuousMode || processedCount >= totalLimit) {
      setIsGenerating(false);
      return;
    }

    const batchSize = Math.min(100, totalLimit - processedCount);
    const result = await handleGenerateTitles(batchSize);
    
    if (result) {
      const newProcessedCount = processedCount + batchSize;
      setProcessedCount(newProcessedCount);
      
      if (newProcessedCount < totalLimit) {
        // Add a small delay between batches to prevent overwhelming the API
        setTimeout(() => {
          processBatchesContinuously();
        }, 1000);
      } else {
        toast({
          title: "Complete!",
          description: `Finished processing ${totalLimit} records`,
        });
        setIsContinuousMode(false);
      }
    } else {
      setIsContinuousMode(false);
    }
  }, [isContinuousMode, processedCount, totalLimit, toast]);

  useEffect(() => {
    if (isContinuousMode && !isGenerating) {
      processBatchesContinuously();
    }
  }, [isContinuousMode, isGenerating, processBatchesContinuously]);

  const startContinuousProcessing = () => {
    setProcessedCount(0);
    setIsContinuousMode(true);
  };

  const stopProcessing = () => {
    setIsContinuousMode(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Continuous Processing</h2>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={totalLimit}
              onChange={(e) => setTotalLimit(parseInt(e.target.value) || 0)}
              min="100"
              step="100"
              className="w-32"
              disabled={isGenerating}
            />
            <Button 
              onClick={startContinuousProcessing}
              disabled={isGenerating}
              className="w-full md:w-auto"
            >
              Start Processing
            </Button>
            <Button 
              onClick={stopProcessing}
              disabled={!isGenerating}
              variant="destructive"
              className="w-full md:w-auto"
            >
              Stop Processing
            </Button>
          </div>
          
          {(isGenerating || processedCount > 0) && (
            <div className="space-y-2">
              <Progress value={(processedCount / totalLimit) * 100} />
              <p className="text-sm text-muted-foreground">
                Processed {processedCount} of {totalLimit} records
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Manual Processing</h2>
          <div>
            <Button 
              onClick={() => handleGenerateTitles(50)}
              className="w-full md:w-auto"
              disabled={isGenerating}
            >
              Generate 50 AI Titles
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to generate AI titles for up to 50 applications that don't have titles yet.
            </p>
          </div>

          <div>
            <Button 
              onClick={() => handleGenerateTitles(100)}
              className="w-full md:w-auto"
              disabled={isGenerating}
            >
              Generate 100 AI Titles
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to generate AI titles for up to 100 applications that don't have titles yet.
            </p>
          </div>

          <div>
            <Button 
              onClick={() => handleGenerateTitles(250)}
              className="w-full md:w-auto"
              disabled={isGenerating}
            >
              Generate 250 AI Titles
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to generate AI titles for up to 250 applications that don't have titles yet.
            </p>
          </div>

          <div>
            <Button 
              onClick={() => handleGenerateTitles(500)}
              className="w-full md:w-auto"
              disabled={isGenerating}
            >
              Generate 500 AI Titles
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to generate AI titles for up to 500 applications that don't have titles yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}