import { Application } from "./planning";
import { SortType } from "@/hooks/use-sort-applications";

export type MapState = {
  selectedId: number | null;
  applications: Application[];
  isMapView: boolean;
  coordinates: [number, number] | null;
  activeSort: SortType | null;
};

export type MapAction = 
  | { type: 'SELECT_APPLICATION'; payload: number | null }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'TOGGLE_VIEW' }
  | { type: 'SET_COORDINATES'; payload: [number, number] }
  | { type: 'SET_SORT'; payload: SortType | null };