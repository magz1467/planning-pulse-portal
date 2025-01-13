import { useState, useEffect } from "react";
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
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
          <span className="text-sm font-medium text-gray-700">Impact Score:</span>
          <span className={`text-sm font-semibold ${application.final_impact_score ? 'text-primary' : 'text-gray-500'}`}>
            {application.final_impact_score ?? 'Not available'}
          </span>
        </div>
      </div>
    </div>
  );
};