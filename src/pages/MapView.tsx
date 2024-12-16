import { useLocation } from "react-router-dom";
import { useEffect, useState, Suspense } from "react";
import { Application } from "@/types/planning";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileApplicationCards } from "@/components/map/MobileApplicationCards";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { MapHeader } from "@/components/map/MapHeader";
import { MapContainerComponent } from "@/components/map/MapContainer";
import { LoadingOverlay } from "@/components/map/LoadingOverlay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapListToggle } from "@/components/map/mobile/MapListToggle";
import { FilterBar } from "@/components/FilterBar";
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

const MapContent = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const [coordinates, setCoordinates] = useState<LatLngTuple | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [filteredApplications, setFilteredApplications] = useState(mockPlanningApplications);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMapView, setIsMapView] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!postcode) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const data = await response.json();
        if (data.status === 200) {
          setCoordinates([data.result.latitude, data.result.longitude]);
          setSelectedApplication(null);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchCoordinates();
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
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (!coordinates) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {isLoading && <LoadingOverlay />}
      <MapHeader />
      
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
          <FilterBar
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
          <MapListToggle
            isMapView={isMapView}
            onToggle={() => setIsMapView(!isMapView)}
          />
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden relative">
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
        
        <div className={`flex-1 h-full relative ${!isMapView && isMobile ? 'hidden' : ''}`}>
          <Suspense fallback={<LoadingOverlay />}>
            <MapContainerComponent
              coordinates={coordinates}
              postcode={postcode}
              applications={filteredApplications}
              selectedApplication={selectedApplication}
              onMarkerClick={handleMarkerClick}
            />
          </Suspense>

          {isMobile && selectedApplication !== null && (
            <MobileApplicationCards
              applications={filteredApplications}
              selectedId={selectedApplication}
              onSelectApplication={handleMarkerClick}
            />
          )}
        </div>
        
        {isMobile && !isMapView && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-4 cursor-pointer"
                onClick={() => handleMarkerClick(app.id)}
              >
                <h3 className="font-semibold text-primary">{app.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{app.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-500">{app.distance}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MapView = () => {
  return (
    <ErrorBoundary>
      <MapContent />
    </ErrorBoundary>
  );
};

export default MapView;