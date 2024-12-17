import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  url: string;
}

// Mock documents - in a real app these would come from the backend
const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Site Plan",
    type: "PDF",
    size: "2.4 MB",
    url: "#"
  },
  {
    id: 2,
    title: "Elevation Drawings",
    type: "PDF",
    size: "1.8 MB",
    url: "#"
  },
  {
    id: 3,
    title: "Design and Access Statement",
    type: "PDF",
    size: "3.1 MB",
    url: "#"
  }
];

export const ApplicationDocuments = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Application Documents</h3>
            <p className="text-sm text-gray-500">
              {mockDocuments.length} documents attached to this application
            </p>
          </div>
          <CollapsibleTrigger className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              {isOpen ? "Hide" : "Show"} documents
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4">
          <div className="space-y-2">
            {mockDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary-dark"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};