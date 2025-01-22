import { Application } from "@/types/planning";

interface ApplicationContentProps {
  application: Application;
}

export const ApplicationContent = ({ application }: ApplicationContentProps) => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{application.description}</p>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-2">Details</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Reference</dt>
            <dd>{application.reference || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Type</dt>
            <dd>{application.type || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Ward</dt>
            <dd>{application.ward || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Decision Due</dt>
            <dd>{application.decisionDue || 'N/A'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};