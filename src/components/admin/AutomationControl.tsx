import { Button } from "@/components/ui/button";
import { useAutomationStatus } from "@/hooks/use-automation-status";

export const AutomationControl = ({ isGenerating }: { isGenerating: boolean }) => {
  const { isAutomationRunning, toggleAutomation } = useAutomationStatus();

  const handleToggle = async () => {
    try {
      await toggleAutomation();
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  return (
    <div className="bg-muted p-4 rounded-lg mb-6">
      <h2 className="text-lg font-medium mb-2">Automation Control</h2>
      <Button 
        onClick={handleToggle}
        className="w-full md:w-auto"
        disabled={isGenerating}
        variant={isAutomationRunning ? "destructive" : "default"}
      >
        {isAutomationRunning ? "Stop Automation" : "Start Automation (50 titles/minute)"}
      </Button>
      <p className="mt-2 text-sm text-muted-foreground">
        {isAutomationRunning 
          ? "Automation is running - generating 50 titles every minute" 
          : "Click to start automated generation of 50 titles every minute"}
      </p>
    </div>
  );
};