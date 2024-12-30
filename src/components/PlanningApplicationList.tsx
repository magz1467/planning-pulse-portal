import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Image from "@/components/ui/image";
import { getStatusColor } from "@/utils/statusColors";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number | null) => void;
}

export const PlanningApplicationList = ({
  applications,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  const [aiHeaders, setAiHeaders] = useState<{ [key: number]: string }>({});

  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) {
      return path;
    }
    return path.startsWith('/') ? path : `/${path}`;
  };

  useEffect(() => {
    const generateHeaders = async () => {
      const headers: { [key: number]: string } = {};
      
      for (const app of applications) {
        if (!aiHeaders[app.id] && app.description) {
          try {
            const { data, error } = await supabase.functions.invoke('generate-listing-header', {
              body: { description: app.description }
            });
            
            if (!error && data?.header) {
              headers[app.id] = data.header;
            }
          } catch (error) {
            console.error('Error generating header:', error);
          }
        }
      }
      
      setAiHeaders(prev => ({ ...prev, ...headers }));
    };

    generateHeaders();
  }, [applications]);

  return (
    <div className="divide-y">
      {applications.map((application) => (
        <div
          key={application.id}
          className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSelectApplication(application.id)}
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {application.image ? (
                <Image
                  src={getImageUrl(application.image)}
                  alt={application.description || ''}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-primary line-clamp-2">
                {aiHeaders[application.id] || application.description || ''}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-gray-600">
                <MapPin className="w-3 h-3" />
                <p className="text-sm truncate">{application.address}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                <span className="text-xs text-gray-500">{application.distance}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};