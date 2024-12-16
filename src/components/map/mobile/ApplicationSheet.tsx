import { Application } from "@/types/planning";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ApplicationPreview } from "./ApplicationPreview";

interface ApplicationSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedApp: Application | undefined;
}

export const ApplicationSheet = ({ isOpen, setIsOpen, selectedApp }: ApplicationSheetProps) => (
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger asChild>
      <div 
        className="h-1 w-12 bg-gray-200 rounded-full mx-auto mb-0.5 cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      />
    </SheetTrigger>
    <SheetContent 
      side="bottom" 
      className="p-0 h-[45vh] rounded-t-xl bg-white shadow-lg"
      style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      <div className="flex flex-col h-full bg-white">
        <div className="p-0.5 border-b bg-white sticky top-0">
          <div 
            className="w-12 h-1 bg-gray-300 rounded-full mx-auto cursor-pointer" 
            onClick={() => setIsOpen(false)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white">
          {selectedApp && (
            <ApplicationPreview
              application={selectedApp}
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);