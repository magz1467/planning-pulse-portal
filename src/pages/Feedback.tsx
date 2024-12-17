import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, AlertCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const Feedback = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Share Your Feedback</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your feedback helps us improve our services. We value all comments, suggestions, and concerns from our users as they help us create a better planning portal for everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <ThumbsUp className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">General Feedback</h2>
                  <p className="text-gray-600 mb-4">Share your thoughts about our service, website usability, or overall experience.</p>
                  <Link to="/contact">
                    <Button>Submit General Feedback</Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Report an Issue</h2>
                  <p className="text-gray-600 mb-4">Let us know if you've encountered any technical problems or errors.</p>
                  <Link to="/contact">
                    <Button variant="destructive">Report Issue</Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Suggest an Improvement</h2>
                  <p className="text-gray-600 mb-4">Have ideas for new features or improvements? We'd love to hear them.</p>
                  <Link to="/contact">
                    <Button variant="secondary">Share Suggestion</Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Planning Process Feedback</h2>
                  <p className="text-gray-600 mb-4">Share your experience with our planning application process.</p>
                  <Link to="/contact">
                    <Button variant="outline">Give Process Feedback</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">What happens to your feedback?</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• All feedback is reviewed by our dedicated customer experience team</li>
              <li>• Technical issues are prioritised and addressed by our development team</li>
              <li>• Suggestions are evaluated for inclusion in future updates</li>
              <li>• We use feedback to inform our service improvements</li>
            </ul>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-600">
              We aim to acknowledge all feedback within 2 working days and provide a detailed response within 5 working days where required. Your input helps us maintain high standards and continually improve our services for all users.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;