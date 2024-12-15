import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { PlanningApplicationList } from '@/components/PlanningApplicationList';
import { PlanningApplicationDetails } from '@/components/PlanningApplicationDetails';
import { Application } from '@/types/planning';
import { FilterBar } from '@/components/FilterBar';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create custom icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const searchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Mock data for planning applications
const mockPlanningApplications: Application[] = [
  {
    id: 1,
    title: "Two-Storey Residential Extension",
    address: "123 High Street",
    status: "Under Review",
    distance: "0.2 miles",
    reference: "APP/2024/001",
    description: "Proposed two-storey side extension to existing dwelling including internal modifications and new windows.",
    applicant: "Mr. James Smith",
    submissionDate: "15/01/2024",
    decisionDue: "15/03/2024",
    type: "Householder Planning Permission",
    ward: "Central Ward",
    officer: "Sarah Johnson",
    consultationEnd: "28/02/2024"
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
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [filteredApplications, setFilteredApplications] = useState(mockPlanningApplications);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});

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

  useEffect(() => {
    let filtered = mockPlanningApplications;
    
    if (activeFilters.status) {
      filtered = filtered.filter(app => app.status === activeFilters.status);
    }
    if (activeFilters.type) {
      filtered = filtered.filter(app => app.type === activeFilters.type);
    }
    
    setFilteredApplications(filtered);
  }, [activeFilters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleMarkerClick = (applicationId: number) => {
    setSelectedApplication(applicationId);
  };

  if (!coordinates) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 overflow-y-auto border-r border-gray-200 bg-white">
        <FilterBar onFilterChange={handleFilterChange} activeFilters={activeFilters} />
        {selectedApplication === null ? (
          <PlanningApplicationList
            applications={filteredApplications}
            postcode={postcode}
            onSelectApplication={setSelectedApplication}
          />
        ) : (
          <PlanningApplicationDetails
            application={mockPlanningApplications.find(app => app.id === selectedApplication)!}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </div>

      <div className="w-2/3">
        <MapContainer 
          center={coordinates}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Search location marker */}
          <Marker position={coordinates} icon={searchIcon}>
            <Popup>
              Search Location: {postcode}
            </Popup>
          </Marker>
          
          {/* Application markers */}
          {filteredApplications.map((application) => {
            // Increased offset for better spread
            const offset = {
              lat: (application.id % 3 - 1) * 0.008,
              lng: (Math.floor(application.id / 3) - 1) * 0.008
            };
            
            return (
              <Marker
                key={application.id}
                position={[
                  coordinates[0] + offset.lat,
                  coordinates[1] + offset.lng
                ]}
                icon={defaultIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(application.id),
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">{application.title}</h3>
                    <p className="text-sm">{application.address}</p>
                    <p className="text-xs mt-1">Status: {application.status}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
