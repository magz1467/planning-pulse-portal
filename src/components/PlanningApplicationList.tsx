import { AlertSignup } from "@/components/AlertSignup";
import { Application } from "@/types/planning";

interface PlanningApplicationListProps {
  applications: Application[];
  postcode: string;
  onSelectApplication: (id: number) => void;
}

export const PlanningApplicationList = ({
  applications,
  postcode,
  onSelectApplication,
}: PlanningApplicationListProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Planning Applications</h2>
      <AlertSignup postcode={postcode} />
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
            onClick={() => onSelectApplication(application.id)}
          >
            <h3 className="font-semibold text-primary">{application.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{application.address}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                {application.status}
              </span>
              <span className="text-xs text-gray-500">{application.distance}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Ref: {application.reference}</p>
          </div>
        ))}
      </div>
    </div>
  );
};