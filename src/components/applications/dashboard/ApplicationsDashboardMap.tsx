import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { MapView } from "./components/MapView";
import { DesktopSidebar } from "@/components/map/DesktopSidebar";
import { FilterBar } from "@/components/FilterBar";

export const ApplicationsDashboardMap = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
  }>({});
  const [activeSort, setActiveSort] = useState<'closingSoon' | 'newest' | null>(null);
  
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
      <div className="flex flex-1 min-h-0 relative">
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

        <div className="flex-1 relative">
          <FilterBar 
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            activeFilters={activeFilters}
            activeSort={activeSort}
          />
          <MapView
            applications={applications}
            selectedId={selectedId}
            onMarkerClick={handleMarkerClick}
            onBoundsChange={fetchApplicationsInBounds}
          />
        </div>
      </div>
    </div>
  );
};