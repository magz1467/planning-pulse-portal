import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { PlanningApplicationList } from '@/components/PlanningApplicationList';
import { PlanningApplicationDetails } from '@/components/PlanningApplicationDetails';
import { Application } from '@/types/planning';
import { FilterBar } from '@/components/FilterBar';
import { ApplicationMarkers } from '@/components/map/ApplicationMarkers';
import { searchIcon } from '@/components/map/MapMarkers';
import type { LatLngTuple } from 'leaflet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
    type: "Extension Residential",
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
    reference: "APP/2024/002",
    type: "Extension Commercial"
  },
  {
    id: 3,
    title: "Garden Development Project",
    address: "78 Park Lane",
    status: "Approved",
    distance: "0.8 miles",
    reference: "APP/2024/003",
    type: "New Build Residential"
  },
  {
    id: 4,
    title: "Office Complex Development",
    address: "90 Business Park",
    status: "Under Review",
    distance: "1.2 miles",
    reference: "APP/2024/004",
    type: "New Build Commercial"
  },
  {
    id: 5,
    title: "Residential Complex",
    address: "120 New Street",
    status: "Declined",
    distance: "1.5 miles",
    reference: "APP/2024/005",
    type: "New Build Residential"
  }
];

const MapView = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const [coordinates, setCoordinates] = useState<LatLngTuple | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [filteredApplications, setFilteredApplications] = useState(mockPlanningApplications);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isMobile = useIsMobile();

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

  const handleMarkerClick = (id: number) => {
    setSelectedApplication(id);
    if (isMobile) {
      setIsFullScreen(true);
    }
  };

  if (!coordinates) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  const selectedApplicationData = selectedApplication 
    ? mockPlanningApplications.find(app => app.id === selectedApplication)
    : null;

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className={`${isMobile && isFullScreen ? 'hidden' : 'w-full md:w-1/3'} overflow-y-auto border-r border-gray-200 bg-white`}>
        <FilterBar onFilterChange={handleFilterChange} activeFilters={activeFilters} />
        {selectedApplication === null ? (
          <PlanningApplicationList
            applications={filteredApplications}
            postcode={postcode}
            onSelectApplication={handleMarkerClick}
          />
        ) : (
          <div className="relative">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setSelectedApplication(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <PlanningApplicationDetails
              application={selectedApplicationData!}
              onClose={() => setSelectedApplication(null)}
            />
          </div>
        )}
      </div>

      {/* Map */}
      <div className={`${isMobile && !isFullScreen ? 'h-[50vh]' : 'flex-1'} relative`}>
        {isMobile && isFullScreen && (
          <Button
            variant="secondary"
            className="absolute top-4 right-4 z-[1000]"
            onClick={() => setIsFullScreen(false)}
          >
            Show List
          </Button>
        )}
        <MapContainer 
          center={coordinates as [number, number]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={coordinates} icon={searchIcon}>
            <Popup>
              Search Location: {postcode}
            </Popup>
          </Marker>
          
          <ApplicationMarkers 
            applications={filteredApplications}
            baseCoordinates={coordinates}
            onMarkerClick={handleMarkerClick}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
