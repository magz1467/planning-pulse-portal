declare module 'react-leaflet' {
  import { Map as LeafletMap, Marker as LeafletMarker, TileLayer as LeafletTileLayer } from 'leaflet';
  import { ComponentProps } from 'react';

  export interface MapContainerProps extends ComponentProps<'div'> {
    center: [number, number];
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    position: [number, number];
    icon?: any;
    eventHandlers?: {
      click: () => void;
    };
    children?: React.ReactNode;
  }

  export const MapContainer: React.FC<MapContainerProps>;
  export const TileLayer: React.FC<{ url: string }>;
  export const Marker: React.FC<MarkerProps>;
}