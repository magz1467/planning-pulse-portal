import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { searchIcon } from "@/components/map/MapMarkers";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileApplicationCards } from "@/components/map/MobileApplicationCards";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { MobileSearchBar } from "@/components/map/mobile/MobileSearchBar";
import type { LatLngTuple } from "leaflet";

const mockPlanningApplications: Application[] = [
  {
    id: 1,
    title: "Two-Storey Residential Extension",
    address: "123 High Street, London, SE1 9PQ",
    status: "Under Review",
    distance: "0.2 miles",
    reference: "APP/2024/001",
    description: "Proposed two-storey side extension to existing dwelling including internal modifications, new windows, and alterations to the roof structure. The development aims to create additional living space while maintaining the architectural character of the area.",
    applicant: "Mr. James Smith",
    submissionDate: "15/01/2024",
    decisionDue: "15/03/2024",
    type: "Extension Residential",
    ward: "Central Ward",
    officer: "Lisa Handy",
    consultationEnd: "28/02/2024",
    image: "/lovable-uploads/ed8c75b6-7e73-4720-818d-f78fbcf2d94a.png"
  },
  {
    id: 2,
    title: "Commercial Property Extension",
    address: "45 Market Square, London, E14 5BP",
    status: "Under Review",
    distance: "0.5 miles",
    reference: "APP/2024/002",
    description: "Extension to existing retail premises including new shopfront, internal alterations and installation of air conditioning units. The proposal includes accessibility improvements and sustainable design features.",
    applicant: "Market Square Ltd",
    submissionDate: "20/01/2024",
    decisionDue: "20/03/2024",
    type: "Extension Commercial",
    ward: "Docklands",
    officer: "John Davies",
    consultationEnd: "15/02/2024",
    image: "/lovable-uploads/bbc0ab46-b246-4a14-b768-a9ee0b4cd8e0.png"
  },
  {
    id: 3,
    title: "Garden Development Project",
    address: "78 Park Lane, London, NW3 6QR",
    status: "Approved",
    distance: "0.8 miles",
    reference: "APP/2024/003",
    description: "Construction of a new garden room and landscaping works including sustainable drainage system. The development includes green roof and solar panels.",
    applicant: "Mrs. Sarah Johnson",
    submissionDate: "10/01/2024",
    decisionDue: "10/03/2024",
    type: "New Build Residential",
    ward: "Hampstead",
    officer: "Michael Brown",
    consultationEnd: "05/02/2024",
    image: "/lovable-uploads/d35bc425-d18f-4222-b9d7-d9418f84b37d.png"
  },
  {
    id: 4,
    title: "Office Complex Development",
    address: "90 Business Park, London, E1 6BT",
    status: "Under Review",
    distance: "1.2 miles",
    reference: "APP/2024/004",
    description: "Development of a new 4-storey office building with associated parking and landscaping. The proposal includes cycle storage, electric vehicle charging points, and a green roof terrace.",
    applicant: "Business Park Developments Ltd",
    submissionDate: "25/01/2024",
    decisionDue: "25/03/2024",
    type: "New Build Commercial",
    ward: "City Fringe",
    officer: "Emma Wilson",
    consultationEnd: "20/02/2024",
    image: "/lovable-uploads/bd79aa29-e80b-4e54-9b5f-7a1a4fe7ea48.png"
  },
  {
    id: 5,
    title: "Residential Complex",
    address: "120 New Street, London, SW1 8NY",
    status: "Declined",
    distance: "1.5 miles",
    reference: "APP/2024/005",
    description: "Construction of a 6-storey residential building comprising 24 apartments with mixed tenure, including affordable housing units. The development includes communal gardens and underground parking.",
    applicant: "New Street Developments",
    submissionDate: "05/01/2024",
    decisionDue: "05/03/2024",
    type: "New Build Residential",
    ward: "Westminster",
    officer: "Robert Taylor",
    consultationEnd: "01/02/2024",
    image: "/lovable-uploads/ea10c55a-9324-434a-8bbf-c2de0a2f9b25.png"
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
  const isMobile = useIsMobile();
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const handleMarkerClick = (id: number) => {
    setSelectedApplication(id);
    if (isMobile) {
      setIsFullScreen(true);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (!coordinates) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
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

      <div className="flex-1 relative">
        {isMobile && <MobileSearchBar />}
        
        <MapContainer
          center={coordinates as [number, number]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker 
            position={coordinates as [number, number]}
            icon={searchIcon}
          >
            <Popup>Search Location: {postcode}</Popup>
          </Marker>
          
          <ApplicationMarkers
            applications={filteredApplications}
            baseCoordinates={coordinates}
            onMarkerClick={handleMarkerClick}
          />
        </MapContainer>

        {isMobile && (
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