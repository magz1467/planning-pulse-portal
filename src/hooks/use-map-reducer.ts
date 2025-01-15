import { useReducer } from 'react';
import { MapState, MapAction } from '@/types/map-reducer';

const initialState: MapState = {
  selectedId: null,
  applications: [],
  isMapView: true,
  coordinates: null
};

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SELECT_APPLICATION':
      return {
        ...state,
        selectedId: action.payload
      };
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload
      };
    case 'TOGGLE_VIEW':
      return {
        ...state,
        isMapView: !state.isMapView
      };
    case 'SET_COORDINATES':
      return {
        ...state,
        coordinates: action.payload
      };
    default:
      return state;
  }
}

export const useMapReducer = (initialApplications: Application[] = []) => {
  const [state, dispatch] = useReducer(mapReducer, {
    ...initialState,
    applications: initialApplications
  });

  return {
    state,
    dispatch
  };
};