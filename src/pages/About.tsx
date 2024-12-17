import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">About PlanningPulse</h1>
            
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <p className="text-lg text-gray-600">
                PlanningPulse is revolutionizing the way communities engage with local planning applications. Our platform bridges the gap between residents, developers, and local authorities, making the planning process more transparent and efficient.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8">Our Vision</h2>
              <p className="text-lg text-gray-600">
                We envision a future where planning decisions are made collaboratively, with genuine input from all stakeholders. By leveraging technology, we're making this vision a reality.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8">Our Impact</h2>
              <p className="text-lg text-gray-600">
                Since our launch, we've helped thousands of residents have their say on local developments, while helping developers better understand community needs and concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;