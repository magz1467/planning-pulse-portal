import { EmptyStateWithEmail } from "../EmptyStateWithEmail";

interface EmptyStateProps {
  postcode: string;
}

export const EmptyState = ({ postcode }: EmptyStateProps) => (
  <EmptyStateWithEmail postcode={postcode} />
);