import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { searchIcon } from "@/components/map/MapMarkers";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { MobileApplicationCards } from "@/components/map/MobileApplicationCards";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";

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
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
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
        console.error("Error fetching coordinates:", error);
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

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <DesktopSidebar
          applications={filteredApplications}
          selectedApplication={selectedApplication}
          postcode={postcode}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onSelectApplication={handleMarkerClick}
          onClose={() => setSelectedApplication(null)}
        />
      )}

      {/* Map */}
      <div className="flex-1 relative">
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
          center={coordinates}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attributionControl={false}
          />
          
          <Marker position={coordinates}>
            <Popup>Search Location: {postcode}</Popup>
          </Marker>
          
          <ApplicationMarkers
            applications={filteredApplications}
            baseCoordinates={coordinates}
            onMarkerClick={handleMarkerClick}
          />
        </MapContainer>

        {/* Mobile Cards */}
        {isMobile && !isFullScreen && (
          <MobileApplicationCards
            applications={filteredApplications}
            selectedId={selectedApplication}
            onSelectApplication={handleMarkerClick}
          />
        )}
      </div>
    </div>
  );
};

export default MapView;
