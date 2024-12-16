import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Application } from "@/types/planning";
import { useIsMobile } from "@/hooks/use-mobile";
import { LatLngTuple } from "leaflet";
import { MapLayout } from "./layout/MapLayout";
import { LoadingOverlay } from "./LoadingOverlay";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const planningImages = [
  "/lovable-uploads/5138b4f3-8820-4457-9664-4a7f54b617a9.png",
  "/lovable-uploads/2a1a1b3d-4e95-4458-a340-d34de8863e11.png",
  "/lovable-uploads/fee12637-0d93-4e12-8044-b053cc205245.png"
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * planningImages.length);
  return planningImages[randomIndex];
};

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
    image: getRandomImage()
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
    image: getRandomImage()
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
    image: getRandomImage()
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
    image: getRandomImage()
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
    image: getRandomImage()
  }
];

export const MapContent = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const [coordinates, setCoordinates] = useState<LatLngTuple | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [filteredApplications, setFilteredApplications] = useState(mockPlanningApplications);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);
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
          // Select the first application by default on mobile after search
          if (isMobile && filteredApplications.length > 0) {
            setSelectedApplication(filteredApplications[0].id);
          } else {
            setSelectedApplication(null);
          }
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
  }, [postcode, isMobile, filteredApplications]);

  useEffect(() => {
    let filtered = mockPlanningApplications;
    
    // Apply filters
    if (activeFilters.status) {
      filtered = filtered.filter(app => app.status === activeFilters.status);
    }
    if (activeFilters.type) {
      filtered = filtered.filter(app => app.type === activeFilters.type);
    }

    // Apply sorting
    if (activeSort) {
      filtered = [...filtered].sort((a, b) => {
        if (activeSort === 'closingSoon') {
          return new Date(a.decisionDue).getTime() - new Date(b.decisionDue).getTime();
        } else if (activeSort === 'newest') {
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
        }
        return 0;
      });
    }
    
    setFilteredApplications(filtered);
  }, [activeFilters, activeSort]);

  const handleMarkerClick = (id: number) => {
    setSelectedApplication(id);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (sortType: 'closingSoon' | 'newest' | null) => {
    setActiveSort(sortType);
  };

  if (!coordinates) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <MapLayout
      isLoading={isLoading}
      coordinates={coordinates}
      postcode={postcode}
      selectedApplication={selectedApplication}
      filteredApplications={filteredApplications}
      activeFilters={activeFilters}
      activeSort={activeSort}
      isMapView={isMapView}
      isMobile={isMobile}
      onMarkerClick={handleMarkerClick}
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
      onToggleView={() => setIsMapView(!isMapView)}
    />
  );
};