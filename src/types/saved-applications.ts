import { Application } from './planning';

export interface SavedApplicationProps {
  application: Application;
  onSelectApplication: (id: number) => void;
  onRemove: (id: number) => void;
}

export interface SavedApplicationsListProps {
  applications: Application[];
  onSelectApplication: (id: number) => void;
  onRemove: (id: number) => void;
}

export interface EmptyStateProps {
  isAuthenticated: boolean;
}