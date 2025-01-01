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
import { useFilteredApplications } from "@/hooks/use-filtered-applications";

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
    setSearchPoint,
    statusCounts
  } = useApplicationsData();

  // Debug logs for applications data
  console.log('ApplicationsDashboardMap - Raw applications data:', applications);
  console.log('ApplicationsDashboardMap - Number of applications:', applications?.length);
  console.log('ApplicationsDashboardMap - Status counts:', statusCounts);
  console.log('ApplicationsDashboardMap - Active filters:', activeFilters);

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Applying filter:', filterType, value);
    console.log('Current applications before filter:', applications?.length);
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

  const selectedApplication = applications?.find(app => app.id === selectedId);
  const isLoading = isLoadingCoords || isLoadingApps;

  // Ensure applications is always an array
  const safeApplications = applications || [];

  // Get filtered applications
  const filteredApplications = useFilteredApplications(safeApplications, activeFilters);

  // Debug logs for filtered applications
  console.log('ApplicationsDashboardMap - Filtered applications:', filteredApplications?.length);

  return (
    <div className="h-screen w-full flex flex-col relative">
      <DashboardHeader />

      <SearchSection 
        onPostcodeSelect={handlePostcodeSelect}
        onFilterChange={searchPoint ? handleFilterChange : undefined}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={isMobile ? () => setIsMapView(!isMapView) : undefined}
        applications={safeApplications}
        statusCounts={statusCounts}
      />

      <div className="flex-1 relative w-full">
        <div className="absolute inset-0 flex">
          {(!isMobile || !isMapView) && searchPoint && (
            <DesktopSidebar
              applications={filteredApplications}
              selectedApplication={selectedId}
              postcode={postcode}
              activeFilters={activeFilters}
              activeSort={activeSort}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onSelectApplication={handleMarkerClick}
              onClose={() => setSelectedId(null)}
              statusCounts={statusCounts}
            />
          )}

          {(!isMobile || isMapView) && coordinates && (
            <div className="flex-1 relative">
              <MapView
                applications={filteredApplications}
                selectedId={selectedId}
                onMarkerClick={handleMarkerClick}
                initialCenter={coordinates}
              />
            </div>
          )}

          {isMobile && !isMapView && searchPoint && (
            <MobileListContainer
              applications={filteredApplications}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-4">
                <p className="text-xl font-medium text-gray-900 text-center mb-4">Loading...</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Verified planning application data from local authorities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Real-time updates and accurate location mapping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Organized and filtered for easy navigation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};