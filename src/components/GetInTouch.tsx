import { Mail } from "lucide-react";
import Image from "@/components/ui/image";
import { ContactForm } from "@/components/contact/ContactForm";

const GetInTouch = () => {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 font-playfair">Get in Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Contact Us</h3>
              </div>
              
              <ContactForm />
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/lovable-uploads/1606c043-38fd-4410-9f1c-ef23667a1d4e.png"
                alt="Our Team"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;