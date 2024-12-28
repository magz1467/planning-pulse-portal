import { SavedApplicationCard } from './SavedApplicationCard';
import { SavedApplicationsListProps } from '@/types/saved-applications';

export const SavedApplicationsList = ({ 
  applications,
  onSelectApplication,
  onRemove
}: SavedApplicationsListProps) => {
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <SavedApplicationCard
          key={application.id}
          application={application}
          onSelectApplication={onSelectApplication}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};