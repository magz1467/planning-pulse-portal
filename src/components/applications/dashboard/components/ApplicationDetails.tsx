import { Application } from "@/types/planning";

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails = ({ application }: ApplicationDetailsProps) => {
  return (
    <div className="w-1/3 h-full overflow-y-auto bg-white p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{application.title}</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Address</h3>
          <p>{application.address}</p>
        </div>
        <div>
          <h3 className="font-semibold">Status</h3>
          <p>{application.status}</p>
        </div>
        <div>
          <h3 className="font-semibold">Reference</h3>
          <p>{application.reference}</p>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p>{application.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Key Dates</h3>
          <p>Submission: {application.submissionDate}</p>
          <p>Decision Due: {application.decisionDue}</p>
          <p>Consultation End: {application.consultationEnd}</p>
        </div>
      </div>
    </div>
  );
};