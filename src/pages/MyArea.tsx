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

const MyArea = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postcode, setPostcode] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const { coordinates } = useCoordinates(postcode);
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
        radius_meters: 500,
        page_size: 100,
        page_number: 0
      });

      if (error) throw error;

      // Transform the data to match the Application type
      const transformedApplications: Application[] = data?.map(app => ({
        id: app.application_id,
        title: app.description || '',
        address: `${app.site_name || ''} ${app.street_name || ''} ${app.locality || ''} ${app.postcode || ''}`.trim(),
        status: app.status || '',
        reference: app.lpa_app_no || '',
        description: app.description || '',
        applicant: app.application_details?.applicant || '',
        submissionDate: app.valid_date || '',
        decisionDue: app.decision_target_date || '',
        type: app.application_type || '',
        ward: app.ward || '',
        officer: app.application_details?.officer || '',
        consultationEnd: app.last_date_consultation_comments || '',
        image: app.image_map_url,
        coordinates: app.centroid?.coordinates ? [app.centroid.coordinates[1], app.centroid.coordinates[0]] : [0, 0],
        postcode: app.postcode || '',
        ai_title: app.ai_title,
        impact_score: app.impact_score,
        impact_score_details: app.impact_score_details,
        application_details: app.application_details
      })) || [];

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
      const { error } = await supabase
        .from('application_feedback')
        .insert([
          {
            application_id: applications[currentIndex].id,
            feedback_type: liked ? 'like' : 'dislike'
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