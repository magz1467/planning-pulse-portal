import { Icon, LatLngTuple } from 'leaflet';
import { MapContainerProps as LeafletMapProps, TileLayerProps as LeafletTileLayerProps, MarkerProps as LeafletMarkerProps } from 'react-leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps extends LeafletMapProps {
    center: LatLngTuple;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
  }

  export interface TileLayerProps extends LeafletTileLayerProps {
    url: string;
    attribution: string;
  }

  export interface MarkerProps extends LeafletMarkerProps {
    position: LatLngTuple;
    icon?: Icon;
    eventHandlers?: {
      click: () => void;
    };
  }
}