import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ScoreHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-lg">Estimated Impact</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p className="text-sm">
              This score is generated using AI analysis of the planning application
              details. We evaluate potential impacts on air quality, noise,
              biodiversity, and community aspects on a scale of 1-5, then normalize
              to a 0-100 scale for easier understanding.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};