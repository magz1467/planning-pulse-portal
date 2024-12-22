declare module 'react-leaflet' {
  import { LatLngTuple } from 'leaflet';
  import { LeafletEventHandlerFnMap } from 'leaflet';
  import { Icon } from 'leaflet';

  export interface MapContainerProps {
    center: LatLngTuple;
    zoom: number;
    scrollWheelZoom: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    className?: string;
  }

  export interface TileLayerProps {
    attribution: string;
    url: string;
    className?: string;
  }

  export interface MarkerProps {
    position: LatLngTuple;
    icon?: Icon;
    eventHandlers?: {
      click: () => void;
    };
    className?: string;
  }
}