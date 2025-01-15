import { Application } from "./planning";

export type MapState = {
  selectedId: number | null;
  applications: Application[];
  isMapView: boolean;
  coordinates: [number, number] | null;
};

export type MapAction = 
  | { type: 'SELECT_APPLICATION'; payload: number | null }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'TOGGLE_VIEW' }
  | { type: 'SET_COORDINATES'; payload: [number, number] };