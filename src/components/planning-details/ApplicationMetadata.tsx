import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSavedApplications } from "@/hooks/use-saved-applications";
import { EmailDialog } from "@/components/EmailDialog";
import { FeedbackEmailDialog } from "@/components/FeedbackEmailDialog";
import { AuthRequiredDialog } from "@/components/AuthRequiredDialog";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Application } from "@/types/planning";

interface ApplicationMetadataProps {
  application: Application;
  onShowEmailDialog: () => void;
}

export const ApplicationMetadata = ({ 
  application,
  onShowEmailDialog,
}: ApplicationMetadataProps) => {
  useEffect(() => {
    console.log('ApplicationMetadata - Application Data:', {
      id: application?.id,
      final_impact_score: application?.final_impact_score,
      title: application?.title
    });
  }, [application]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{application.title}</h2>
        <p className="text-gray-600">{application.reference}</p>
        <p className="text-gray-600">Final Impact Score: {application.final_impact_score ?? 'null'}</p>
      </div>
    </div>
  );
};