import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapContentLayout } from "./MapContentLayout";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { useMapState } from "@/hooks/use-map-state";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Mock data moved to a separate constant
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
  },
  {
    id: 6,
    title: "Mixed-Use Development",
    address: "156 Queen's Road, London, N1 8QP",
    status: "Under Review",
    distance: "1.7 miles",
    reference: "APP/2024/006",
    description: "Proposed mixed-use development comprising ground floor retail units and residential apartments above. The scheme includes sustainable features and public realm improvements.",
    applicant: "Urban Developments Ltd",
    submissionDate: "28/01/2024",
    decisionDue: "28/03/2024",
    type: "New Build Commercial",
    ward: "Islington",
    officer: "David Chen",
    consultationEnd: "22/02/2024",
    image: getRandomImage()
  },
  {
    id: 7,
    title: "Heritage Building Conversion",
    address: "34 Church Street, London, EC3V 9BQ",
    status: "Approved",
    distance: "2.0 miles",
    reference: "APP/2024/007",
    description: "Conversion of Grade II listed building into luxury apartments with careful preservation of historic features. Includes sympathetic modern additions and restoration work.",
    applicant: "Heritage Homes Ltd",
    submissionDate: "12/01/2024",
    decisionDue: "12/03/2024",
    type: "Extension Residential",
    ward: "City",
    officer: "Sarah Williams",
    consultationEnd: "08/02/2024",
    image: getRandomImage()
  },
  {
    id: 8,
    title: "Sustainable Housing Development",
    address: "89 Green Lane, London, SE15 4RY",
    status: "Under Review",
    distance: "2.3 miles",
    reference: "APP/2024/008",
    description: "Development of 15 eco-friendly homes with solar panels, ground source heat pumps, and rainwater harvesting systems. Includes community garden space.",
    applicant: "EcoHomes Development",
    submissionDate: "30/01/2024",
    decisionDue: "30/03/2024",
    type: "New Build Residential",
    ward: "Peckham",
    officer: "James Wilson",
    consultationEnd: "25/02/2024",
    image: getRandomImage()
  },
  {
    id: 9,
    title: "Community Center Renovation",
    address: "12 Victoria Road, London, W8 5RN",
    status: "Declined",
    distance: "2.6 miles",
    reference: "APP/2024/009",
    description: "Comprehensive renovation and extension of existing community center, including new sports facilities and meeting rooms. Improvements to accessibility and energy efficiency.",
    applicant: "Community Trust",
    submissionDate: "08/01/2024",
    decisionDue: "08/03/2024",
    type: "Extension Commercial",
    ward: "Kensington",
    officer: "Patricia Lee",
    consultationEnd: "02/02/2024",
    image: getRandomImage()
  },
  {
    id: 10,
    title: "Retail Park Redevelopment",
    address: "200 Commercial Road, London, E1 1LP",
    status: "Under Review",
    distance: "3.0 miles",
    reference: "APP/2024/010",
    description: "Major redevelopment of existing retail park to create modern shopping destination with improved parking facilities, pedestrian access, and landscaping.",
    applicant: "Retail Ventures Ltd",
    submissionDate: "22/01/2024",
    decisionDue: "22/03/2024",
    type: "New Build Commercial",
    ward: "Tower Hamlets",
    officer: "Mark Thompson",
    consultationEnd: "18/02/2024",
    image: getRandomImage()
  }
];

export const MapContent = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const [isMapView, setIsMapView] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { coordinates, isLoading } = useCoordinates(postcode);
  const filteredApplications = useFilteredApplications(
    mockPlanningApplications,
    activeFilters,
    activeSort
  );

  const {
    selectedApplication,
    activeFilters,
    activeSort,
    handleMarkerClick,
    handleFilterChange,
    handleSortChange
  } = useMapState(coordinates, filteredApplications, isMobile, isMapView);

  const saveSearch = async (postcode: string, status: string) => {
    try {
      const { data: auth } = await supabase.auth.getSession();
      const isLoggedIn = !!auth.session;

      const { error } = await supabase
        .from('Searches')
        .insert([
          {
            "Post Code": postcode,
            "Status": status,
            "User_logged_in": isLoggedIn
          }
        ]);

      if (error) {
        console.error('Error saving search:', error);
        toast({
          title: "Error",
          description: "There was a problem saving your search. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  return (
    <MapContentLayout
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
      onToggleView={() => {
        setIsMapView(!isMapView);
        if (!isMapView) {
          handleMarkerClick(null);
        }
      }}
    />
  );
};
