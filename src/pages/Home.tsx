import { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Planning Pulse</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your central hub for tracking and managing planning applications.
        </p>
      </div>
    </div>
  );
};

export default Home;