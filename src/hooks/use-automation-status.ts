import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAutomationStatus = () => {
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial automation status
    const checkAutomationStatus = async () => {
      const { data, error } = await supabase
        .from('automation_status')
        .select('is_active')
        .eq('name', 'generate_ai_titles')
        .single();

      if (error) {
        console.error('Error fetching automation status:', error);
        return;
      }

      setIsAutomationRunning(data.is_active);
    };

    checkAutomationStatus();

    // Subscribe to automation status changes
    const channel = supabase
      .channel('automation_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'automation_status',
          filter: 'name=eq.generate_ai_titles'
        },
        (payload) => {
          setIsAutomationRunning(payload.new.is_active);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleAutomation = async () => {
    const newStatus = !isAutomationRunning;
    
    const { data, error } = await supabase
      .rpc('toggle_automation', {
        automation_name: 'generate_ai_titles',
        new_status: newStatus
      });

    if (error) {
      console.error('Error toggling automation:', error);
      toast({
        title: "Error",
        description: "Failed to toggle automation. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: newStatus ? "Automation Started" : "Automation Stopped",
      description: newStatus 
        ? "Generating 50 AI titles every minute. You can stop this at any time."
        : "AI title generation automation has been stopped.",
    });
  };

  return {
    isAutomationRunning,
    toggleAutomation
  };
};