import { Card } from "@/components/ui/card";

interface PetitionsTabProps {
  petitions: any[];
}

export const PetitionsTab = ({ petitions }: PetitionsTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Petitions</h2>
      {petitions.length > 0 ? (
        <div className="space-y-4">
          {petitions.map((petition) => (
            <Card key={petition.id} className="p-4">
              <h3 className="font-semibold">{petition.applications.title}</h3>
              <p className="text-sm text-gray-500">{petition.applications.address}</p>
              <div className="mt-2">
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                  {petition.applications.status}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Reasons:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {petition.reasons.map((reason: string, index: number) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven't created any petitions yet.</p>
      )}
    </Card>
  );
};