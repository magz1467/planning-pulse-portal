import { Application } from "@/types/planning";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "@/components/ui/image";

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails = ({ application }: ApplicationDetailsProps) => {
  return (
    <div className="w-[400px] h-full bg-white border-l overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Application Details</h2>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {application.image && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={application.image}
              alt={application.title}
              width={400}
              height={225}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{application.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{application.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1">{application.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reference</p>
              <p className="mt-1">{application.reference}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="mt-1">{application.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ward</p>
              <p className="mt-1">{application.ward}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Submitted</p>
              <p className="mt-1">{application.submissionDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Decision Due</p>
              <p className="mt-1">{application.decisionDue}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1 text-sm">{application.description}</p>
          </div>

          <div className="pt-4 space-y-2">
            <Button className="w-full" variant="outline">
              Save Application
            </Button>
            <Button className="w-full">
              Comment on Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};