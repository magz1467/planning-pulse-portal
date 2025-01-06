import { Map } from 'leaflet';

export interface MapState {
  map: Map | null;
  center: [number, number];
  zoom: number;
}

export interface MapActions {
  setMap: (map: Map | null) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}

export interface MapViewProps {
  applications: any[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number | null) => void;
  onCenterChange: (center: [number, number]) => void;
  onMapMove?: (map: Map) => void;
  isMobile?: boolean;
  isMapView?: boolean;
}