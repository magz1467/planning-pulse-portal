import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapContentLayout } from "@/components/map/MapContentLayout";
import { useCoordinates } from "@/hooks/use-coordinates";
import { useFilteredApplications } from "@/hooks/use-filtered-applications";
import { useMapState } from "@/hooks/use-map-state";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Application } from "@/types/planning";

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
  } = useMapState(coordinates as [number, number], [], isMobile, isMapView);

  useEffect(() => {
    if (initialFilter) {
      handleFilterChange("status", initialFilter);
    }
  }, [initialFilter, handleFilterChange]);

  // Ensure coordinates are properly typed
  const safeCoordinates: [number, number] = coordinates ? [coordinates[0], coordinates[1]] : [52.0406, -0.7594];

  const handleViewToggle = () => {
    setIsMapView(!isMapView);
    // Clear selection when switching views
    handleMarkerClick(null);
  };

  // Use filtered applications from Supabase data
  const filteredApplications = useFilteredApplications(
    [], // We'll get applications directly from the dashboard component
    activeFilters
  );

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