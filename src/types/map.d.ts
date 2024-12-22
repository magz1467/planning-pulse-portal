import { Icon, LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps extends React.ComponentProps<typeof MapContainer> {
    center: LatLngTuple;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface TileLayerProps extends React.ComponentProps<typeof TileLayer> {
    attribution: string;
    url: string;
  }

  export interface MarkerProps extends React.ComponentProps<typeof Marker> {
    position: LatLngTuple;
    icon?: Icon;
    eventHandlers?: {
      click: () => void;
    };
  }
}