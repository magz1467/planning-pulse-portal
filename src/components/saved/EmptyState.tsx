import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyStateProps } from '@/types/saved-applications';

export const EmptyState = ({ isAuthenticated }: EmptyStateProps) => {
  if (!isAuthenticated) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600 mb-4">Sign in to save and view your favorite applications</p>
        <Button onClick={() => {/* Add your sign in logic here */}}>
          Sign In
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <p className="text-gray-600">You haven't saved any applications yet</p>
    </Card>
  );
};