import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SavedDevelopmentsTabProps {
  onSelectApplication: (id: number) => void;
}

export const SavedDevelopmentsTab = ({ onSelectApplication }: SavedDevelopmentsTabProps) => {
  const [savedDevelopments, setSavedDevelopments] = useState<any[]>([]);

  useEffect(() => {
    const fetchSavedDevelopments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('saved_developments')
        .select(`
          *,
          developments (
            id,
            title,
            address,
            status
          )
        `)
        .eq('user_id', session.user.id);

      if (!error && data) {
        setSavedDevelopments(data);
      }
    };

    fetchSavedDevelopments();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Saved Developments</h2>
      <div className="space-y-4">
        {savedDevelopments.map((saved) => (
          <div
            key={saved.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectApplication(saved.developments.id)}
          >
            <h3 className="font-medium">{saved.developments.title}</h3>
            <p className="text-sm text-gray-600">{saved.developments.address}</p>
            <p className="text-sm text-gray-500">{saved.developments.status}</p>
          </div>
        ))}
        {savedDevelopments.length === 0 && (
          <p className="text-gray-500">No saved developments</p>
        )}
      </div>
    </Card>
  );
};