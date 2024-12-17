import { useEffect } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { ContactSection } from "@/components/ContactSection";

const Help = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-12">Help & Support</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Chat with Us</h2>
            <p className="text-gray-600 mb-4">
              Get immediate assistance through our chat support. Our team is here to help you with any questions or issues.
            </p>
            <Chatbot />
          </div>
          
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Email Support</h2>
            <p className="text-gray-600 mb-6">
              Prefer email? Reach out to our dedicated support teams below:
            </p>
            <ContactSection 
              title="General Support"
              description="For general inquiries and assistance with using our platform."
              email="support@planningpulse.com"
            />
            <ContactSection 
              title="Technical Support"
              description="Having technical issues? Our tech team is ready to help."
              email="tech@planningpulse.com"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;