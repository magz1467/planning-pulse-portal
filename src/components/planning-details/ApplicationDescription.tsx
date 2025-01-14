import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ApplicationDescriptionProps {
  application?: Application;
}

const transformText = (text: string) => {
  // Don't transform if text is not all caps
  if (text !== text.toUpperCase()) return text;
  
  // Split into words and transform each
  return text.split(' ').map(word => {
    // Skip short words that might be acronyms (like UK, US, etc)
    if (word.length <= 3) return word;
    
    // Transform the word to title case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

export const ApplicationDescription = ({ application }: ApplicationDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!application) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Description</h3>
      <div className="relative">
        <p className={`text-sm ${!isExpanded ? "line-clamp-2" : ""}`}>
          {transformText(application.description || '')}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-primary hover:text-primary/80 flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              Show less
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};