import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock data for planning applications
const mockPlanningApplications = [
  {
    id: 1,
    title: "New Residential Development",
    address: "123 High Street",
    status: "Pending",
    distance: "0.2 miles",
    reference: "APP/2024/001"
  },
  {
    id: 2,
    title: "Commercial Property Extension",
    address: "45 Market Square",
    status: "Under Review",
    distance: "0.5 miles",
    reference: "APP/2024/002"
  },
  {
    id: 3,
    title: "Garden Development Project",
    address: "78 Park Lane",
    status: "Approved",
    distance: "0.8 miles",
    reference: "APP/2024/003"
  }
];

const MapView = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const data = await response.json();
        if (data.status === 200) {
          setCoordinates([data.result.latitude, data.result.longitude]);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (postcode) {
      fetchCoordinates();
    }
  }, [postcode]);

  if (!coordinates) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar with planning applications list */}
      <div className="w-1/3 overflow-y-auto border-r border-gray-200 bg-white">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Planning Applications</h2>
          <div className="space-y-4">
            {mockPlanningApplications.map((application) => (
              <div
                key={application.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
              >
                <h3 className="font-semibold text-primary">{application.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{application.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                    {application.status}
                  </span>
                  <span className="text-xs text-gray-500">{application.distance}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Ref: {application.reference}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="w-2/3">
        <MapContainer
          center={coordinates as L.LatLngExpression}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates as L.LatLngExpression}>
            <Popup>
              Postcode: {postcode}
            </Popup>
          </Marker>
          {/* Add markers for mock planning applications */}
          {mockPlanningApplications.map((application) => (
            <Marker
              key={application.id}
              position={[
                coordinates[0] + (Math.random() - 0.5) * 0.01,
                coordinates[1] + (Math.random() - 0.5) * 0.01
              ] as L.LatLngExpression}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{application.title}</h3>
                  <p className="text-sm">{application.address}</p>
                  <p className="text-xs mt-1">Status: {application.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;