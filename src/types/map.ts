export interface Application {
  application_id: number;
  description: string;
  development_type: string;
  application_type: string;
  application_details: any;
}

export interface MapViewProps {
  applications: Application[];
  selectedId: number;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
  onCenterChange: (center: [number, number]) => void;
  onMapMove?: (map: any) => void; // Added this optional prop
}
