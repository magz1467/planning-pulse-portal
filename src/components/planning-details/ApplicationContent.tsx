import { Application } from "@/types/planning";

interface ApplicationContentProps {
  application: Application;
}

export const ApplicationContent = ({ application }: ApplicationContentProps) => {
  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <p>{application.description}</p>
      </div>
    </div>
  );
};