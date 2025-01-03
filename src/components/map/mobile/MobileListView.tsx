import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { getStatusColor } from "@/utils/statusColors";
import { useState } from "react";

interface MobileListViewProps {
  postcode: string;
  applications: Application[];
  onSelectApplication: (id: number) => void;
  onShowEmailDialog: () => void;
}

export const MobileListView = ({
  postcode,
  applications,
  onSelectApplication,
  onShowEmailDialog,
}: MobileListViewProps) => {
  const [showAlerts, setShowAlerts] = useState(true);

  return (
    <div className="absolute inset-0 flex flex-col h-full max-h-[100dvh] overflow-hidden bg-gray-50">
      {showAlerts && (
        <div className="p-4 bg-white border-b relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => setShowAlerts(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Get Updates for This Area</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Stay informed about new planning applications near {postcode}
            </p>
            <Button 
              className="w-full"
              onClick={onShowEmailDialog}
            >
              Get Alerts
            </Button>
          </div>
        </div>
      )}
      <div className="p-4 space-y-4 overflow-y-auto">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectApplication(app.id)}
          >
            <div className="flex gap-4">
              {app.image && (
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={app.image}
                    alt={app.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary truncate">{app.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{app.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-500">{app.distance}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};