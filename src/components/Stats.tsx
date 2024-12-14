import { CheckCircle, Users, FileText } from "lucide-react";

export const Stats = () => {
  return (
    <div className="flex gap-6 items-center justify-center mb-6">
      <div className="flex items-center gap-2">
        <CheckCircle className="text-primary" size={20} />
        <span className="text-sm">Verified data source</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="text-primary" size={20} />
        <span className="text-sm">50k+ monthly users</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="text-primary" size={20} />
        <span className="text-sm">100k+ applications tracked</span>
      </div>
    </div>
  );
};