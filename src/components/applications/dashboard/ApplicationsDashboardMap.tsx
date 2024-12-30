import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applicationIcon, selectedApplicationIcon } from "@/components/map/MapMarkers";
import { Application } from "@/types/planning";
import L from 'leaflet';
import 'leaflet.markercluster';

// Component to handle map events and bounds
const MapEventHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      // Prevent zooming out past initial zoom level
      if (map.getZoom() < 12) {
        map.setZoom(12);
      }
    }
  });
  return null;
};

export const ApplicationsDashboardMap = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { toast } = useToast();
  const LONDON_COORDINATES: [number, number] = [51.5074, -0.1278];
  const mapRef = useRef<L.Map | null>(null);

  const fetchApplicationsInBounds = async (bounds: L.LatLngBounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    
    const { data, error } = await supabase
      .rpc('get_applications_in_bounds', {
        sw_lng: sw.lng,
        sw_lat: sw.lat,
        ne_lng: ne.lng,
        ne_lat: ne.lat
      });

    if (error) {
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    if (!data || data.length === 0) {
      return;
    }

    // Transform the data to match the Application type
    const transformedData = data?.map(app => {
      // Extract coordinates from PostGIS geometry
      const geomObj = app.geom;
      let coordinates: [number, number] | null = null;

      // Handle PostGIS geometry object
      if (geomObj && typeof geomObj === 'object' && 'coordinates' in geomObj) {
        coordinates = [
          geomObj.coordinates[1] as number, // Latitude
          geomObj.coordinates[0] as number  // Longitude
        ];
      }

      if (!coordinates) {
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

  const handleBoundsChange = (bounds: L.LatLngBounds) => {
    fetchApplicationsInBounds(bounds);
  };

  useEffect(() => {
    // Initial fetch when map loads
    if (mapRef.current) {
      fetchApplicationsInBounds(mapRef.current.getBounds());
    }
  }, []);

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const selectedApplication = applications.find(app => app.id === selectedId);

  return (
    <div className="h-screen w-full flex">
      <div className="w-full h-full relative">
        <MapContainer
          ref={mapRef}
          center={LONDON_COORDINATES}
          zoom={12}
          minZoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <MapEventHandler onBoundsChange={handleBoundsChange} />
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