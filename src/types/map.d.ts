import { Icon, LatLngTuple } from 'leaflet';
import { MapContainer as LeafletMapContainer, TileLayer as LeafletTileLayer, Marker as LeafletMarker } from 'react-leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps {
    children?: React.ReactNode;
    center: LatLngTuple;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
  }

  export interface TileLayerProps {
    attribution: string;
    url: string;
  }

  export interface MarkerProps {
    position: LatLngTuple;
    icon?: Icon;
    eventHandlers?: {
      click: () => void;
    };
  }

  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<TileLayerProps>;
  export const Marker: React.FC<MarkerProps>;
}