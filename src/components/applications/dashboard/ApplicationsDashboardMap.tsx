import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { MapView } from "./components/MapView";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileListContainer } from "@/components/map/mobile/MobileListContainer";
import { useCoordinates } from "@/hooks/use-coordinates";
import { DashboardHeader } from "./components/DashboardHeader";
import { SearchSection } from "./components/SearchSection";

export const ApplicationsDashboardMap = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState('SW1A 0AA'); // Default to Westminster
  const isMobile = useIsMobile();
  
  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint
  } = useApplicationsData();

  console.log('ApplicationsDashboardMap - Current applications:', applications?.length);

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Applying filter:', filterType, value);
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      if (searchPoint) {
        fetchApplicationsInRadius(searchPoint, newFilters);
      }
      return newFilters;
    });
  };

  const handlePostcodeSelect = async (newPostcode: string) => {
    setPostcode(newPostcode);
  };

  // When coordinates are loaded, update the search point and fetch applications
  const isInitialSearch = !searchPoint && coordinates;
  const isNewSearch = searchPoint && coordinates && 
    (searchPoint[0] !== coordinates[0] || searchPoint[1] !== coordinates[1]);

  if ((isInitialSearch || isNewSearch) && coordinates) {
    setSearchPoint(coordinates);
    fetchApplicationsInRadius(coordinates, activeFilters);
  }

  const handleSortChange = (sortType: 'closingSoon' | 'newest' | null) => {
    setActiveSort(sortType);
  };

  const selectedApplication = applications.find(app => app.id === selectedId);
  const isLoading = isLoadingCoords || isLoadingApps;

  return (
    <div className="h-screen w-full flex flex-col">
      <DashboardHeader />

      <SearchSection 
        onPostcodeSelect={handlePostcodeSelect}
        onFilterChange={searchPoint ? handleFilterChange : undefined}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={isMobile ? () => setIsMapView(!isMapView) : undefined}
        applications={applications}
      />

      <div className="flex-1 relative w-full">
        <div className="absolute inset-0 flex">
          {(!isMobile || !isMapView) && searchPoint && (
            <DesktopSidebar
              applications={applications}
              selectedApplication={selectedId}
              postcode={postcode}
              activeFilters={activeFilters}
              activeSort={activeSort}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onSelectApplication={handleMarkerClick}
              onClose={() => setSelectedId(null)}
            />
          )}

          {(!isMobile || isMapView) && coordinates && (
            <div className="flex-1 relative">
              <MapView
                applications={applications}
                selectedId={selectedId}
                onMarkerClick={handleMarkerClick}
                initialCenter={coordinates}
              />
            </div>
          )}

          {isMobile && !isMapView && searchPoint && (
            <MobileListContainer
              applications={applications}
              selectedApplication={selectedId}
              postcode={postcode}
              onSelectApplication={handleMarkerClick}
              onShowEmailDialog={() => {}}
              hideFilterBar={true}
            />
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};