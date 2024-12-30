import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applicationIcon, selectedApplicationIcon } from "@/components/map/MapMarkers";
import { Application } from "@/types/planning";

export const ApplicationsDashboardMap = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { toast } = useToast();
  const LONDON_COORDINATES: [number, number] = [51.5074, -0.1278];

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, geom')
        .not('geom', 'is', null); // Only fetch records with geometry

      if (error) {
        toast({
          title: "Error fetching applications",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match the Application type
      const transformedData = data?.map(app => {
        // Extract coordinates from PostGIS geometry
        const geomText = app.geom as string;
        const match = geomText?.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        const coordinates = match ? [parseFloat(match[2]), parseFloat(match[1])] as [number, number] : null;

        if (!coordinates) {
          console.warn('Invalid geometry for application:', app.application_id);
          return null;
        }

        return {
          id: app.application_id,
          title: app.description || '',
          address: `${app.site_name || ''} ${app.street_name || ''} ${app.locality || ''} ${app.postcode || ''}`.trim(),
          status: app.status || '',
          distance: 'N/A',
          reference: app.lpa_app_no || '',
          description: app.description || '',
          applicant: typeof app.application_details === 'object' ? 
            (app.application_details as any)?.applicant || '' : '',
          submissionDate: app.valid_date || '',
          decisionDue: app.decision_target_date || '',
          type: app.application_type || '',
          ward: app.ward || '',
          officer: typeof app.application_details === 'object' ? 
            (app.application_details as any)?.officer || '' : '',
          consultationEnd: app.last_date_consultation_comments || '',
          image: '/placeholder.svg',
          coordinates
        };
      }).filter((app): app is Application & { coordinates: [number, number] } => 
        app !== null && app.coordinates !== null
      );

      setApplications(transformedData || []);
    };

    fetchApplications();
  }, [toast]);

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const selectedApplication = applications.find(app => app.id === selectedId);

  return (
    <div className="h-screen w-full flex">
      <div className="w-full h-full relative">
        <MapContainer
          center={LONDON_COORDINATES}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {applications.map((app) => (
            <Marker
              key={app.id}
              position={app.coordinates}
              icon={app.id === selectedId ? selectedApplicationIcon : applicationIcon}
              eventHandlers={{
                click: () => handleMarkerClick(app.id),
              }}
            >
              <Popup>
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">{app.title}</h3>
                  <p className="text-sm text-gray-600">{app.address}</p>
                  <p className="text-sm text-gray-600 mt-1">Status: {app.status}</p>
                  <Button 
                    className="mt-2 w-full"
                    onClick={() => handleMarkerClick(app.id)}
                  >
                    View Details
                  </Button>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedApplication && (
        <div className="w-1/3 h-full overflow-y-auto bg-white p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{selectedApplication.title}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>{selectedApplication.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{selectedApplication.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Reference</h3>
              <p>{selectedApplication.reference}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{selectedApplication.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Key Dates</h3>
              <p>Submission: {selectedApplication.submissionDate}</p>
              <p>Decision Due: {selectedApplication.decisionDue}</p>
              <p>Consultation End: {selectedApplication.consultationEnd}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};