import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const Investors = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Investor Relations</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Transforming Urban Planning</h2>
            <p className="text-gray-700 mb-6">
              PlanningPulse is at the forefront of revolutionizing the urban planning and development sector. 
              Our innovative platform bridges the gap between communities, developers, and local authorities, 
              making the planning process more transparent, efficient, and accessible for everyone.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Market Opportunity</h2>
            <p className="text-gray-700 mb-6">
              The UK planning sector processes over 400,000 applications annually, with a market size exceeding 
              £1.5 billion. Our platform addresses critical inefficiencies in this market, providing solutions 
              that benefit all stakeholders while creating significant value.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Leadership Team</h2>
            <p className="text-gray-700 mb-6">
              Our team combines deep expertise in urban planning, technology, and business scaling. With 
              backgrounds from leading tech companies and planning authorities, we understand both the 
              technical challenges and market dynamics of our sector.
            </p>
          </section>

          <section className="bg-primary-light p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
            <p className="text-gray-700 mb-4">
              We're always interested in connecting with strategic investors who share our vision for 
              transforming urban planning and development.
            </p>
            <p className="text-gray-700">
              For investment inquiries, please contact our team at{" "}
              <a 
                href="mailto:marco@nimbygram.com" 
                className="text-secondary hover:text-secondary/80 font-medium"
              >
                marco@nimbygram.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investors;