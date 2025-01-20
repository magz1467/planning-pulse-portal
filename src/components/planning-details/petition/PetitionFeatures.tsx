import { FC } from 'react';

export const PetitionFeatures: FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="text-primary text-xl">📝</span>
        <p className="text-sm text-gray-600">Instant petition creation to challenge applications</p>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-primary text-xl">🌟</span>
        <p className="text-sm text-gray-600">Easy share with your local network</p>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-primary text-xl">📨</span>
        <p className="text-sm text-gray-600">Template ready for you to send to the council</p>
      </div>
    </div>
  );
};