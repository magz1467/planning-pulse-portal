import { Map } from 'leaflet';
import { Application } from './planning';
import { SortType } from '@/hooks/use-sort-applications';

export interface MapState {
  selectedId: number | null;
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: SortType | null;
}

export interface MapActions {
  handleMarkerClick: (id: number | null) => void;
  handleFilterChange: (filterType: string, value: string) => void;
  handleSortChange: (sortType: SortType | null) => void;
}

export interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: Map) => void;
  isMobile?: boolean;
  isMapView?: boolean;
}