import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin } from 'lucide-react';
import { SavedApplicationProps } from '@/types/saved-applications';

export const SavedApplicationCard = ({ 
  application, 
  onSelectApplication,
  onRemove 
}: SavedApplicationProps) => {
  return (
    <Card 
      key={application.id}
      className="p-4 hover:border-primary cursor-pointer transition-colors"
      onClick={() => onSelectApplication(application.id)}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {application.image ? (
            <img
              src={application.image}
              alt={application.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-primary truncate">{application.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(application.id);
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Heart className="h-5 w-5 fill-current" />
            </Button>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <p className="text-sm truncate">{application.address}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
              {application.status}
            </span>
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};