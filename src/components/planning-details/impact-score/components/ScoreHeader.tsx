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
              This score is calculated using real data from the planning application, 
              analyzing potential impacts on air quality, noise, biodiversity, and community aspects. 
              Our AI evaluates these factors on a scale of 1-5, then normalizes to 0-100 for easier understanding.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};