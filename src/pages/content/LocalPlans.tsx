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
          <p className="lead">Local Plans are crucial documents that set out the strategic priorities for development of an area and cover housing, commercial, public space and infrastructure needs.</p>
          
          <h2>Understanding Local Plans</h2>
          <p>A Local Plan is a document that sets out local planning policies and identifies how land is used, determining what will be built where. They are a critical tool for guiding decisions about development proposals of all sizes.</p>
          
          <h2>Key Components</h2>
          <ul>
            <li>Strategic Policies</li>
            <li>Development Management Policies</li>
            <li>Site Allocations</li>
            <li>Infrastructure Requirements</li>
          </ul>
          
          <h2>Expert Resources</h2>
          <ul>
            <li><a href="https://www.local.gov.uk/topics/planning" target="_blank" rel="noopener noreferrer">Local Government Association Planning Resources</a></li>
            <li><a href="https://www.tcpa.org.uk/" target="_blank" rel="noopener noreferrer">Town and Country Planning Association</a></li>
            <li><a href="https://www.planningresource.co.uk/" target="_blank" rel="noopener noreferrer">Planning Resource</a></li>
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LocalPlans;