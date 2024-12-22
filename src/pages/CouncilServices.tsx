import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/council/ContactForm";
import { useState } from "react";

const CouncilServices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section with Image */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src="/lovable-uploads/ea10c55a-9324-434a-8bbf-c2de0a2f9b25.png"
            alt="Local authority building"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">For Local Authorities</h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                Streamline your planning process and enhance community engagement
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Transform Your Planning Process
              </h2>
              
              <p className="text-lg text-gray-700 mb-8">
                We help councils simplify and accelerate their planning process while improving resident satisfaction through:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">•</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Streamlined Processing</h3>
                      <p className="text-gray-600">Automated application processing and management for increased efficiency</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">•</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Automated Consultation</h3>
                      <p className="text-gray-600">Efficient feedback collection and stakeholder engagement</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">•</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Enhanced Transparency</h3>
                      <p className="text-gray-600">Improved communication with residents and stakeholders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary">•</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                      <p className="text-gray-600">Make informed decisions with comprehensive analytics</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <Footer />
    </>
  );
};

export default CouncilServices;