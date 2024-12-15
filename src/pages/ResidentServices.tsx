import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ResidentServices = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">For Residents</h1>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <p className="text-lg text-gray-700 mb-6">
              We empower residents to easily give feedback and get transparency on local developments. Our platform makes it simple to:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Search and track planning applications in your area</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Submit feedback directly to developers and local authorities</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Stay informed about changes and updates to applications</span>
              </li>
            </ul>
            <Link to="/map">
              <Button className="w-full">View Local Applications</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResidentServices;