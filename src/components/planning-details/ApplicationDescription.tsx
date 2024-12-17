import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ApplicationDescriptionProps {
  application?: Application;
}

export const ApplicationDescription = ({ application }: ApplicationDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!application) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Description</h3>
      <div className="relative">
        <p className={`text-sm ${!isExpanded ? "line-clamp-2" : ""}`}>
          {application.description}
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