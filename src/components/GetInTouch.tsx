import { Mail, Phone, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const GetInTouch = () => {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 font-playfair">Get in Touch</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Email Us</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Have a question? Send us an email and we'll get back to you.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:hello@nimbygram.com">Send Email</a>
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Call Us</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Need immediate assistance? Give us a call.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="tel:+442080000000">020 8000 0000</a>
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Linkedin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Follow Us</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Connect with us on LinkedIn for updates.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="https://www.linkedin.com/company/nimbygram" target="_blank" rel="noopener noreferrer">
                  Connect
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;