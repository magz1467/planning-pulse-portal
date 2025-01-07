import { Application } from "@/types/planning";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { supabase } from "@/integrations/supabase/client";
import { DetailContent } from "./components/DetailContent";
import { ActionButtons } from "./components/ActionButtons";
import { Link } from "react-router-dom";

interface PlanningApplicationDetailsProps {
  application?: Application;
  onClose?: () => void;
}

export const PlanningApplicationDetails = ({
  application,
  onClose,
}: PlanningApplicationDetailsProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { savedApplications } = useSavedApplications();
  const { toast } = useToast();

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!application) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const isSavedApp = savedApplications?.some(
        (saved) => saved.application_id === application.id
      );
      setIsSaved(!!isSavedApp);
    };

    checkIfSaved();
  }, [application, savedApplications]);

  if (!application) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">No application selected</h3>
          <p className="text-sm text-gray-500 mt-2">
            Select an application to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                Applications
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                to={`/applications/${application.id}`}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {application.reference}
              </Link>
            </div>
            <h1 className="text-xl font-semibold mt-1">
              {application.ai_title || application.description}
            </h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <span className="sr-only">Close panel</span>
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <DetailContent application={application} />
        <ActionButtons 
          applicationId={application.id}
          isSaved={isSaved}
        />
      </div>
    </div>
  );
};