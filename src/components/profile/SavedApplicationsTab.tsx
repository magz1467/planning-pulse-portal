import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SavedApplicationsTabProps {
  onSelectApplication: (id: number) => void;
}

export const SavedApplicationsTab = ({ onSelectApplication }: SavedApplicationsTabProps) => {
  const [savedApplications, setSavedApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchSavedApplications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('saved_applications')
        .select(`
          *,
          applications (
            id,
            title,
            address,
            status
          )
        `)
        .eq('user_id', session.user.id);

      if (!error && data) {
        setSavedApplications(data);
      }
    };

    fetchSavedApplications();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Saved Applications</h2>
      <div className="space-y-4">
        {savedApplications.map((saved) => (
          <div
            key={saved.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectApplication(saved.applications.id)}
          >
            <h3 className="font-medium">{saved.applications.title}</h3>
            <p className="text-sm text-gray-600">{saved.applications.address}</p>
            <p className="text-sm text-gray-500">{saved.applications.status}</p>
          </div>
        ))}
        {savedApplications.length === 0 && (
          <p className="text-gray-500">No saved applications</p>
        )}
      </div>
    </Card>
  );
};