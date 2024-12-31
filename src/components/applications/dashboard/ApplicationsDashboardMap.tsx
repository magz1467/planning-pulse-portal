import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { MapView } from "./components/MapView";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/FilterBar";
import { MobileListContainer } from "@/components/map/mobile/MobileListContainer";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { useCoordinates } from "@/hooks/use-coordinates";

export const ApplicationsDashboardMap = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);
  const [isMapView, setIsMapView] = useState(true);
  const [postcode, setPostcode] = useState('');
  const isMobile = useIsMobile();
  
  const { coordinates, isLoading: isLoadingCoords } = useCoordinates(postcode);
  
  const { 
    applications, 
    isLoading: isLoadingApps, 
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint
  } = useApplicationsData();

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleFilterChange = (filterType: string, value: string) => {
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
      <header className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <Home className="h-6 w-6" />
              PlanningPulse
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <PostcodeSearch 
          onSelect={handlePostcodeSelect}
          placeholder="Search new location"
          className="w-full max-w-xl mx-auto"
        />
      </div>

      {searchPoint && (
        <>
          <FilterBar 
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            activeFilters={activeFilters}
            activeSort={activeSort}
            isMapView={isMapView}
            onToggleView={isMobile ? () => setIsMapView(!isMapView) : undefined}
          />

          <div className="flex-1 relative w-full">
            <div className="absolute inset-0 flex">
              {(!isMobile || !isMapView) && (
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

              {isMobile && !isMapView && (
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
        </>
      )}

      {!searchPoint && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg">Enter a location to view planning applications</p>
          </div>
        </div>
      )}

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