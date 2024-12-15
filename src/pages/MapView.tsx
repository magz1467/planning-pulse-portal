import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock data for planning applications
const mockPlanningApplications = [
  {
    id: 1,
    title: "Two-Storey Residential Extension",
    address: "123 High Street",
    status: "Under Review",
    distance: "0.2 miles",
    reference: "APP/2024/001",
    description: "Proposed two-storey side extension to existing dwelling including internal modifications and new windows.",
    applicant: "Mr. James Smith",
    submissionDate: "15/01/2024",
    decisionDue: "15/03/2024",
    type: "Householder Planning Permission",
    ward: "Central Ward",
    officer: "Sarah Johnson",
    consultationEnd: "28/02/2024"
  },
  {
    id: 2,
    title: "Commercial Property Extension",
    address: "45 Market Square",
    status: "Under Review",
    distance: "0.5 miles",
    reference: "APP/2024/002"
  },
  {
    id: 3,
    title: "Garden Development Project",
    address: "78 Park Lane",
    status: "Approved",
    distance: "0.8 miles",
    reference: "APP/2024/003"
  }
];

const MapView = () => {
  const location = useLocation();
  const postcode = location.state?.postcode;
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const data = await response.json();
        if (data.status === 200) {
          setCoordinates([data.result.latitude, data.result.longitude]);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (postcode) {
      fetchCoordinates();
    }
  }, [postcode]);

  const handleFeedback = (type: 'positive' | 'negative') => {
    toast({
      title: "Thank you for your feedback",
      description: "Your response has been recorded.",
      duration: 3000,
    });
  };

  const handleCommentSubmit = (comment: string) => {
    toast({
      title: "Comment submitted",
      description: "Thank you for your detailed feedback.",
      duration: 3000,
    });
  };

  if (!coordinates) {
    return <div className="flex items-center justify-center h-screen">Loading map...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar with either list or detailed view */}
      <div className="w-1/3 overflow-y-auto border-r border-gray-200 bg-white">
        {selectedApplication === null ? (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Planning Applications</h2>
            <div className="space-y-4">
              {mockPlanningApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => setSelectedApplication(application.id)}
                >
                  <h3 className="font-semibold text-primary">{application.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{application.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                      {application.status}
                    </span>
                    <span className="text-xs text-gray-500">{application.distance}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Ref: {application.reference}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Application Details</h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500"
              >
                ✕
              </Button>
            </div>
            
            {mockPlanningApplications.filter(app => app.id === selectedApplication).map(application => (
              <div key={application.id} className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{application.title}</h3>
                  <p className="text-gray-600 mt-1">{application.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Reference</p>
                    <p className="text-gray-600">{application.reference}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status</p>
                    <p className="text-gray-600">{application.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Submission Date</p>
                    <p className="text-gray-600">{application.submissionDate}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Decision Due</p>
                    <p className="text-gray-600">{application.decisionDue}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Type</p>
                    <p className="text-gray-600">{application.type}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Ward</p>
                    <p className="text-gray-600">{application.ward}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Case Officer</p>
                    <p className="text-gray-600">{application.officer}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Consultation Ends</p>
                    <p className="text-gray-600">{application.consultationEnd}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{application.description}</p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Quick Feedback</h4>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleFeedback('positive')}
                    >
                      <ThumbsUp className="mr-2" /> Support
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleFeedback('negative')}
                    >
                      <ThumbsDown className="mr-2" /> Object
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Leave a Comment</h4>
                  <Textarea
                    placeholder="Share your thoughts about this planning application..."
                    className="mb-4"
                  />
                  <Button
                    onClick={() => handleCommentSubmit("Comment text")}
                    className="w-full"
                  >
                    Submit Comment
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map container */}
      <div className="w-2/3">
        <MapContainer
          center={coordinates}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates as L.LatLngExpression}>
            <Popup>
              Postcode: {postcode}
            </Popup>
          </Marker>
          {/* Add markers for mock planning applications */}
          {mockPlanningApplications.map((application) => (
            <Marker
              key={application.id}
              position={[
                coordinates[0] + (Math.random() - 0.5) * 0.01,
                coordinates[1] + (Math.random() - 0.5) * 0.01
              ] as L.LatLngExpression}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{application.title}</h3>
                  <p className="text-sm">{application.address}</p>
                  <p className="text-xs mt-1">Status: {application.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
