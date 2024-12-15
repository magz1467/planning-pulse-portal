import { Application } from "@/types/planning";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface MobileApplicationCardsProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number) => void;
}

export const MobileApplicationCards = ({
  applications,
  selectedId,
  onSelectApplication,
}: MobileApplicationCardsProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-[1000] pb-safe">
      <div className="p-2 border-b">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
      </div>
      <ScrollArea className="h-[30vh]">
        <div className="flex gap-2 p-4 overflow-x-auto">
          {applications.map((app) => (
            <Card
              key={app.id}
              className={`flex-shrink-0 w-[280px] p-4 cursor-pointer transition-all ${
                selectedId === app.id ? "border-primary" : ""
              }`}
              onClick={() => onSelectApplication(app.id)}
            >
              <h3 className="font-semibold text-primary truncate">{app.title}</h3>
              <p className="text-sm text-gray-600 mt-1 truncate">{app.address}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                  {app.status}
                </span>
                <span className="text-xs text-gray-500">{app.distance}</span>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};