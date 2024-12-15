import { Icon, LatLngTuple } from 'leaflet';
import { MapContainerProps, TileLayerProps, MarkerProps } from 'react-leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps extends MapContainerProps {
    center: LatLngTuple;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
  }

  export interface TileLayerProps extends TileLayerProps {
    url: string;
    attribution: string;
  }

  export interface MarkerProps extends MarkerProps {
    position: LatLngTuple;
    icon?: Icon;
  }
}