import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CouncilServices = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">For Local Authorities</h1>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <p className="text-lg text-gray-700 mb-6">
              We help councils simplify and accelerate their planning process while improving resident satisfaction through:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Streamlined application processing and management</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Automated consultation and feedback collection</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Enhanced transparency and communication with residents</span>
              </li>
            </ul>
            <Button className="w-full">Contact Us</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CouncilServices;