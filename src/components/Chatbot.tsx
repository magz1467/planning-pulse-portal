import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get visible applications from your state management
      // This is just an example - you'll need to integrate with your actual application state
      const { data: applications, error } = await supabase
        .from('applications')
        .select('*')
        .limit(10);

      if (error) throw error;

      const { data, error: functionError } = await supabase.functions.invoke('analyze-applications', {
        body: { 
          applications,
          query: message 
        }
      });

      if (functionError) throw functionError;

      setResponse(data.analysis);
      setMessage("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Ask about planning applications in this area..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
      </div>
      {response && (
        <Textarea
          value={response}
          readOnly
          className="min-h-[100px]"
        />
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Ask AI Assistant"}
      </Button>
    </form>
  );
};
