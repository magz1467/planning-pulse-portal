import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/FilterBar";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { useMapData } from "@/components/map/hooks/useMapData";
import { usePostcodeSearch } from "@/components/map/hooks/usePostcodeSearch";

const MapView = () => {
  const isMobile = useIsMobile();
  const {
    applications,
    selectedId,
    setSelectedId,
    isLoading,
    isMapView,
    setIsMapView,
    activeSort,
    setActiveSort,
    coordinates,
    activeFilters,
    setActiveFilters,
    statusCounts,
    fetchPins
  } = useMapData();

  const { handlePostcodeSelect } = usePostcodeSearch(fetchPins);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      if (value === prev[filterType as keyof typeof prev]) {
        const newFilters = { ...prev };
        delete newFilters[filterType as keyof typeof prev];
        return newFilters;
      }
      return {
        ...prev,
        [filterType]: value
      };
    });
  };

  const handleToggleView = () => {
    setIsMapView(!isMapView);
  };
  
  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <div className="p-4 bg-white border-b">
          <PostcodeSearch
            onSelect={handlePostcodeSelect}
            placeholder="Search postcode to find planning applications"
            className="w-full max-w-xl mx-auto mb-4"
          />
        </div>
        <FilterBar 
          onFilterChange={handleFilterChange}
          onSortChange={setActiveSort}
          activeFilters={activeFilters}
          activeSort={activeSort}
          isMapView={isMapView}
          onToggleView={handleToggleView}
          applications={applications}
          statusCounts={statusCounts}
        />
        <MapContent 
          applications={applications}
          selectedId={selectedId}
          coordinates={coordinates}
          isMobile={isMobile}
          isMapView={isMapView}
          onMarkerClick={(id) => {
            console.log('🖱️ Marker clicked:', id);
            setSelectedId(id);
          }}
          isLoading={isLoading}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MapView;