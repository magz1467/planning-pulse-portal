import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Map } from "lucide-react";

const LocalPlans = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Map className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Local Plans and Development Frameworks</h1>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-lg text-gray-700">Local Plans are statutory documents that set out the strategic priorities for development within a local planning authority area. They are crucial in shaping how land use and development takes place in your area.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Understanding Local Plans</h2>
          <p>A Local Plan is a long-term strategic document that guides development in your area, typically looking 15-20 years ahead. It's prepared by the Local Planning Authority with input from the community, developers, and other stakeholders. Learn more about the process on the <a href="https://www.gov.uk/guidance/local-plans" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Government's Local Plans guidance page</a>.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Key Components of Local Plans</h2>
          <div className="ml-6">
            <h3 className="text-xl font-medium mt-4 mb-2">1. Strategic Policies</h3>
            <p>These set out the overall strategy for development patterns, including:</p>
            <ul className="list-disc ml-6">
              <li>Housing numbers and distribution</li>
              <li>Employment land allocation</li>
              <li>Retail and leisure development</li>
              <li>Infrastructure requirements</li>
              <li>Environmental protection measures</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">2. Development Management Policies</h3>
            <p>These provide detailed guidance for assessing planning applications, covering:</p>
            <ul className="list-disc ml-6">
              <li>Design standards</li>
              <li>Parking requirements</li>
              <li>Housing mix and affordable housing</li>
              <li>Environmental performance</li>
              <li>Heritage protection</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">3. Site Allocations</h3>
            <p>Specific sites identified for development, including:</p>
            <ul className="list-disc ml-6">
              <li>Housing sites</li>
              <li>Employment areas</li>
              <li>Retail locations</li>
              <li>Protected open spaces</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">The Local Plan Process</h2>
          <ol className="list-decimal ml-6 space-y-4">
            <li><strong>Evidence Gathering</strong> - Collection of data about housing needs, employment, environment, etc.</li>
            <li><strong>Issues and Options</strong> - Initial consultation on key issues and potential approaches</li>
            <li><strong>Preferred Options</strong> - Detailed proposals are developed and consulted upon</li>
            <li><strong>Publication</strong> - Final draft plan is published for formal representations</li>
            <li><strong>Submission and Examination</strong> - Independent examination by a Planning Inspector</li>
            <li><strong>Adoption</strong> - Final plan is adopted by the council</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Neighborhood Planning</h2>
          <p>Neighborhood Plans allow communities to develop a shared vision for their area and shape development. Visit the <a href="https://locality.org.uk/services-tools/neighbourhood-planning/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Locality Neighbourhood Planning</a> website for guidance.</p>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Expert Resources</h2>
            <ul className="space-y-2">
              <li>• <a href="https://www.local.gov.uk/topics/planning" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Local Government Association Planning Resources</a></li>
              <li>• <a href="https://www.tcpa.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Town and Country Planning Association</a></li>
              <li>• <a href="https://www.planningresource.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Resource</a></li>
              <li>• <a href="https://www.rtpi.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Royal Town Planning Institute</a></li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LocalPlans;