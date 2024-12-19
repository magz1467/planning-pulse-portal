import { useState, useEffect } from "react";
import { findClosestApplication } from "@/utils/distance";
import { Application } from "@/types/planning";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { MapState, MapActions } from "@/types/map";

export const useMapState = (
  coordinates: [number, number] | null,
  applications: Application[],
  isMobile: boolean,
  isMapView: boolean
): MapState & MapActions => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<MapState["activeFilters"]>({});
  const [activeSort, setActiveSort] = useState<MapState["activeSort"]>(null);
  const { toast } = useToast();

  // Handle URL parameters on mount and when applications load
  useEffect(() => {
    const applicationId = searchParams.get('application');
    if (applicationId) {
      const id = parseInt(applicationId, 10);
      if (!isNaN(id)) {
        const applicationExists = applications.some(app => app.id === id);
        if (applicationExists) {
          setSelectedApplication(id);
        } else {
          toast({
            title: "Application not found",
            description: "The planning application you're looking for could not be found.",
            variant: "destructive",
          });
          searchParams.delete('application');
          setSearchParams(searchParams);
        }
      }
    }
  }, [searchParams, applications]);

  // Effect to select the closest application when coordinates change
  useEffect(() => {
    if (coordinates && applications.length > 0 && isMobile && isMapView) {
      const applicationCoordinates: [number, number][] = applications.map(() => [
        coordinates[0] + (Math.random() - 0.5) * 0.01,
        coordinates[1] + (Math.random() - 0.5) * 0.01
      ]);

      const closestId = findClosestApplication(
        applications,
        coordinates,
        applicationCoordinates
      );
      handleMarkerClick(closestId);
    }
  }, [coordinates, applications, isMobile, isMapView]);

  const handleMarkerClick = (id: number | null) => {
    setSelectedApplication(id);
    if (id !== null) {
      setSearchParams({ application: id.toString() });
    } else {
      searchParams.delete('application');
      setSearchParams(searchParams);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (sortType: MapState["activeSort"]) => {
    setActiveSort(sortType);
  };

  return {
    selectedApplication,
    activeFilters,
    activeSort,
    handleMarkerClick,
    handleFilterChange,
    handleSortChange
  };
};