import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DeveloperServices = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">For Developers</h1>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <p className="text-lg text-gray-700 mb-6">
              We offer developers the opportunity to improve their planning applications through:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Access to historical data on successful applications in the area</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Early feedback from local residents before council decisions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Direct engagement with the local community</span>
              </li>
            </ul>
            <Button className="w-full">Start Your Application</Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DeveloperServices;