import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Image from "@/components/ui/image";

const ResidentServices = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h1 className="text-4xl font-bold mb-6 text-primary">
                  Empowering Local Residents
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Access the same powerful tools and insights that big developers use. Our platform brings transparency and equal opportunity to local planning decisions.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="h-6 w-6 mr-3 text-primary">✓</div>
                    <p>Real-time notifications about planning applications in your area</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 mr-3 text-primary">✓</div>
                    <p>Advanced mapping technology to visualize developments</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 mr-3 text-primary">✓</div>
                    <p>Direct communication channel with developers and councils</p>
                  </div>
                </div>
                <Link to="/map">
                  <Button size="lg" className="w-full md:w-auto">
                    View Local Applications
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-3"></div>
                <Image
                  src="/lovable-uploads/c21e23a0-f1e5-43ef-b085-aff9c1f2fa76.png"
                  alt="Local resident using planning application platform"
                  className="rounded-2xl shadow-lg relative z-10"
                  width={800}
                  height={600}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Stay Informed</h3>
                <p className="text-gray-600">
                  Get instant notifications about new planning applications in your area. No more surprises about local developments.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Make Your Voice Heard</h3>
                <p className="text-gray-600">
                  Submit feedback directly through our platform. Your opinions matter and help shape your community's future.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  Access detailed analytics and historical data to make informed decisions about local developments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResidentServices;