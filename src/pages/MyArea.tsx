import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types/planning';
import { PostcodeSearch } from '@/components/PostcodeSearch';
import { Chatbot } from '@/components/Chatbot';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCoordinates } from '@/hooks/use-coordinates';
import { Database } from '@/integrations/supabase/types';

type ApplicationResponse = Database['public']['Tables']['applications']['Row'];

const MyArea = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postcode, setPostcode] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const { coordinates, isLoading: isLoadingCoordinates } = useCoordinates(postcode);
  const { toast } = useToast();

  useEffect(() => {
    if (coordinates) {
      fetchApplications();
    }
  }, [coordinates]);

  const fetchApplications = async () => {
    if (!coordinates) return;

    try {
      const { data, error } = await supabase.rpc('get_applications_within_radius', {
        center_lng: coordinates[1],
        center_lat: coordinates[0],
        radius_meters: 1000, // Set a default radius of 1km
        page_size: 100,
        page_number: 0
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({
          title: "No applications found",
          description: "No planning applications found in this area. Try a different postcode or increase the search radius.",
          variant: "default",
        });
        setApplications([]);
        return;
      }

      // Transform the data to match the Application type
      const transformedApplications: Application[] = data?.map((app: ApplicationResponse) => {
        const appDetails = app.application_details as Record<string, any> | null;
        const centroid = app.centroid as { coordinates: [number, number] } | null;
        
        return {
          id: app.application_id,
          title: app.description || '',
          address: `${app.site_name || ''} ${app.street_name || ''} ${app.locality || ''} ${app.postcode || ''}`.trim(),
          status: app.status || '',
          reference: app.lpa_app_no || '',
          description: app.description || '',
          applicant: appDetails?.applicant || '',
          submissionDate: app.valid_date || '',
          decisionDue: app.decision_target_date || '',
          type: app.application_type || '',
          ward: app.ward || '',
          officer: appDetails?.officer || '',
          consultationEnd: app.last_date_consultation_comments || '',
          image: app.image_map_url || undefined,
          coordinates: centroid?.coordinates ? [centroid.coordinates[1], centroid.coordinates[0]] : [0, 0],
          postcode: app.postcode || '',
          ai_title: app.ai_title || undefined,
          impact_score: app.impact_score || null,
          impact_score_details: app.impact_score_details as Record<string, any> || {},
          application_details: appDetails || null,
          impacted_services: app.impacted_services as Record<string, any> || {}
        };
      }) || [];

      if (transformedApplications.length > 0) {
        toast({
          title: "Applications found",
          description: `Found ${transformedApplications.length} applications in your area`,
          variant: "default",
        });
      }

      setApplications(transformedApplications);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (!applications[currentIndex]) return;

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save feedback",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('application_feedback')
        .insert([
          {
            application_id: applications[currentIndex].id,
            feedback_type: liked ? 'like' : 'dislike',
            user_id: user.id // Include the user_id in the insert
          }
        ]);

      if (error) throw error;

      toast({
        title: liked ? "Application Liked" : "Application Skipped",
        description: liked ? "We'll keep you updated on this application" : "We won't show you this application again",
      });

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast({
        title: "Error",
        description: "Failed to save your feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentApplication = applications[currentIndex];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">My Area</h1>
        
        {!postcode ? (
          <div className="space-y-4">
            <h2 className="text-xl text-center">Enter your postcode to get started</h2>
            <PostcodeSearch
              onSelect={setPostcode}
              placeholder="Enter your postcode"
              className="w-full"
            />
          </div>
        ) : isLoadingCoordinates ? (
          <div className="text-center">
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center">
            <p>No applications found in your area</p>
            <Button 
              onClick={() => setPostcode('')}
              className="mt-4"
            >
              Try another postcode
            </Button>
          </div>
        ) : currentIndex >= applications.length ? (
          <div className="text-center">
            <p>You've seen all applications in your area!</p>
            <Button 
              onClick={() => setPostcode('')}
              className="mt-4"
            >
              Try another postcode
            </Button>
          </div>
        ) : (
          <div className="relative">
            <AnimatePresence>
              {currentApplication && (
                <motion.div
                  key={currentApplication.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-xl shadow-lg overflow-hidden"
                >
                  {currentApplication.image && (
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src={currentApplication.image}
                        alt={currentApplication.description}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-4">
                    <h3 className="text-lg font-semibold">
                      {currentApplication.description}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentApplication.address}
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full"
                        onClick={() => handleSwipe(false)}
                      >
                        <ThumbsDown className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full"
                        onClick={() => handleSwipe(true)}
                      >
                        <ThumbsUp className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <Button
          variant="outline"
          className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0"
          onClick={() => setShowChatbot(show => !show)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        {showChatbot && (
          <div className="fixed bottom-20 right-4 w-80">
            <div className="bg-card rounded-lg shadow-lg p-4">
              <Chatbot />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArea;