import { FC } from 'react';

const SavedApplications: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Saved Applications</h1>
        <p className="text-lg text-muted-foreground">
          View and manage your saved planning applications here.
        </p>
      </div>
    </div>
  );
};

export default SavedApplications;