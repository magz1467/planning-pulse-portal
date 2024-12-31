import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapContentLayout } from "@/components/map/MapContentLayout";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { useMapState } from "@/hooks/use-map-state";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { generateMockApplications } from "@/utils/mockDataGenerator";
import { Application } from "@/types/planning";
import { Tables } from "@/integrations/supabase/types";

// Generate 200 mock applications
const mockPlanningApplications = generateMockApplications(200);

export const MapContent = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const initialFilter = location.state?.initialFilter;
  const [isMapView, setIsMapView] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { coordinates, isLoading } = useCoordinates(postcode);

  const {
    selectedApplication,
    activeFilters,
    activeSort,
    handleMarkerClick,
    handleFilterChange,
    handleSortChange,
  } = useMapState(coordinates as [number, number], mockPlanningApplications, isMobile, isMapView);

  useEffect(() => {
    if (initialFilter) {
      handleFilterChange("status", initialFilter);
    }
  }, [initialFilter, handleFilterChange]);

  const transformApplication = (app: Tables<'applications'>): Application => ({
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
    coordinates: app.geom ? [
      (app.geom as any).coordinates[1],
      (app.geom as any).coordinates[0]
    ] as [number, number] : [51.5074, -0.1278]
  });

  const filteredApplications = useFilteredApplications(
    mockPlanningApplications.map(transformApplication),
    activeFilters
  );

  // Only auto-select first application on mobile and in map view
  useEffect(() => {
    if (isMobile && isMapView && filteredApplications.length > 0 && !selectedApplication) {
      handleMarkerClick(filteredApplications[0].id);
    }
  }, [postcode, filteredApplications, selectedApplication, handleMarkerClick, isMapView, isMobile]);

  // Ensure coordinates are properly typed
  const safeCoordinates: [number, number] = coordinates ? [coordinates[0], coordinates[1]] : [52.0406, -0.7594];

  const handleViewToggle = () => {
    setIsMapView(!isMapView);
    // Clear selection when switching views
    handleMarkerClick(null);
  };

  return (
    <MapContentLayout
      isLoading={isLoading}
      coordinates={safeCoordinates}
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
      onToggleView={handleViewToggle}
    />
  );
};