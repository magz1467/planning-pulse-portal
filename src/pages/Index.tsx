import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First fetch the trial data
        const { data: response, error: fetchError } = await supabase.functions.invoke('fetch-trial-data');
        
        if (fetchError) throw fetchError;

        // Then get the data from the table
        const { data: applications, error: dbError } = await supabase
          .from('trial_application_data')
          .select('*');

        if (dbError) throw dbError;
        
        setData(applications || []);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Planning Applications Data</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Reference</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{app.application_reference}</td>
                <td className="px-4 py-2 border">{app.description}</td>
                <td className="px-4 py-2 border">{app.status}</td>
                <td className="px-4 py-2 border">{app.address}</td>
                <td className="px-4 py-2 border">
                  {app.submission_date && new Date(app.submission_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;