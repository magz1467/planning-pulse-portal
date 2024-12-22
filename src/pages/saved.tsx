import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { SavedDevelopments } from '@/components/SavedDevelopments';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types/planning';

const SavedPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectApplication = (id: number) => {
    navigate('/map', { state: { selectedApplication: id } });
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Developments</h1>
          <SavedDevelopments 
            applications={[]} 
            onSelectApplication={handleSelectApplication}
          />
        </div>
      </main>
    </div>
  );
};

export default SavedPage;