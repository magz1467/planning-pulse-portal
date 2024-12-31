import { Application } from "@/types/planning";

interface ApplicationHeaderProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">
        {application.title || application.description}
      </h2>
      <p className="text-sm text-gray-600">{application.reference}</p>
    </div>
  );
};