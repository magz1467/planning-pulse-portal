import { ChevronDown } from "lucide-react";
import { Application } from "@/types/planning";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface CollapsibleApplicationDetailsProps {
  application: Application;
}

export const CollapsibleApplicationDetails = ({ application }: CollapsibleApplicationDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="flex items-center justify-center w-full py-2 hover:bg-gray-50">
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <Card className="p-4">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-gray-600">Reference:</dt>
            <dd>{application.reference}</dd>
            
            <dt className="text-gray-600">Type:</dt>
            <dd>{application.type}</dd>
            
            <dt className="text-gray-600">Applicant:</dt>
            <dd>{application.applicant}</dd>
            
            <dt className="text-gray-600">Submission Date:</dt>
            <dd>{application.submissionDate}</dd>
            
            <dt className="text-gray-600">Ward:</dt>
            <dd>{application.ward}</dd>
            
            <dt className="text-gray-600">Case Officer:</dt>
            <dd>{application.officer}</dd>
          </dl>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};