import { Card } from "@/components/ui/card";
import { Application } from "@/types/planning";

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails = ({ application }: ApplicationDetailsProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Application Details</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-gray-600">Reference:</dt>
        <dd>{application.reference}</dd>
        <dt className="text-gray-600">Applicant:</dt>
        <dd>{application.applicant}</dd>
        <dt className="text-gray-600">Submission Date:</dt>
        <dd>{application.submissionDate}</dd>
        <dt className="text-gray-600">Decision Due:</dt>
        <dd>{application.decisionDue}</dd>
        <dt className="text-gray-600">Ward:</dt>
        <dd>{application.ward}</dd>
        <dt className="text-gray-600">Case Officer:</dt>
        <dd>{application.officer}</dd>
        <dt className="text-gray-600">Consultation End:</dt>
        <dd>{application.consultationEnd}</dd>
      </dl>
    </Card>
  );
};