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

export const ApplicationsDashboardMap = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);
  const [isMapView, setIsMapView] = useState(true);
  const isMobile = useIsMobile();
  
  const { 
    applications, 
    isLoading, 
    fetchApplicationsInBounds 
  } = useApplicationsData();

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
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

  const selectedApplication = applications.find(app => app.id === selectedId);

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

      <FilterBar 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={isMobile ? () => setIsMapView(!isMapView) : undefined}
      />

      <div className="flex flex-1 min-h-0 relative">
        {(!isMobile || !isMapView) && (
          <DesktopSidebar
            applications={applications}
            selectedApplication={selectedId}
            postcode=""
            activeFilters={activeFilters}
            activeSort={activeSort}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onSelectApplication={handleMarkerClick}
            onClose={() => setSelectedId(null)}
          />
        )}

        {(!isMobile || isMapView) && (
          <div className="flex-1 relative">
            <MapView
              applications={applications}
              selectedId={selectedId}
              onMarkerClick={handleMarkerClick}
              onBoundsChange={fetchApplicationsInBounds}
            />
          </div>
        )}

        {isMobile && !isMapView && (
          <MobileListContainer
            applications={applications}
            selectedApplication={selectedId}
            postcode=""
            onSelectApplication={handleMarkerClick}
            onShowEmailDialog={() => {}}
          />
        )}
      </div>
    </div>
  );
};