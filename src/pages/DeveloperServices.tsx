import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Users, ChartBar, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const DeveloperServices = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-4">Planning Made Simple</h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Whether you're a homeowner planning an extension or a large-scale developer,
            we're here to streamline your planning process.
          </p>

          {/* Individual Homeowners Section */}
          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Home className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl">For Individual Homeowners</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get it right the first time</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: Users, text: "Get early feedback from neighbors before submission" },
                      { icon: CheckCircle, text: "Understand local planning policies and requirements" },
                      { icon: MessageSquare, text: "Direct communication with planning officers" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <item.icon className="h-5 w-5 text-primary mt-1" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Why choose us?</h3>
                  <p className="text-gray-700 mb-6">
                    Our platform helps you navigate the planning process with confidence. 
                    Get early feedback, make necessary adjustments, and increase your chances 
                    of approval - all before official submission.
                  </p>
                  <Button size="lg" className="w-full md:w-auto">
                    Start Your Application
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Large Scale Developers Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl">For Large Scale Developers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Data-Driven Decisions</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: ChartBar, text: "Access comprehensive local planning data and trends" },
                      { icon: Users, text: "Understand community sentiment before submission" },
                      { icon: MessageSquare, text: "Engage with stakeholders through our platform" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <item.icon className="h-5 w-5 text-primary mt-1" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Enterprise Solutions</h3>
                  <p className="text-gray-700 mb-6">
                    Our platform provides valuable insights and streamlines community 
                    engagement. Make informed decisions based on real data and local 
                    sentiment analysis.
                  </p>
                  <Button size="lg" className="w-full md:w-auto">
                    Book a Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DeveloperServices;