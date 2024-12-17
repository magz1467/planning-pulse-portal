import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Building } from "lucide-react";

const SustainableDevelopment = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Building className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sustainable Development in Planning</h1>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-lg text-gray-700">Sustainable development is the cornerstone of the UK planning system. This guide explores how sustainability principles are incorporated into planning decisions and what this means for development proposals.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What is Sustainable Development?</h2>
          <p>The UK planning system defines sustainable development as meeting the needs of the present without compromising future generations' ability to meet their own needs. This is supported by three interdependent objectives outlined in the <a href="https://www.gov.uk/government/publications/national-planning-policy-framework--2" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">National Planning Policy Framework (NPPF)</a>.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">The Three Pillars of Sustainability</h2>
          <div className="ml-6">
            <h3 className="text-xl font-medium mt-4 mb-2">1. Environmental Protection</h3>
            <ul className="list-disc ml-6">
              <li>Protecting and enhancing natural environments</li>
              <li>Improving biodiversity</li>
              <li>Using natural resources prudently</li>
              <li>Minimizing waste and pollution</li>
              <li>Mitigating and adapting to climate change</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">2. Economic Growth</h3>
            <ul className="list-disc ml-6">
              <li>Building a strong, responsive economy</li>
              <li>Ensuring sufficient land availability</li>
              <li>Supporting innovation and improved productivity</li>
              <li>Creating job opportunities</li>
              <li>Identifying and coordinating infrastructure requirements</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">3. Social Progress</h3>
            <ul className="list-disc ml-6">
              <li>Supporting strong, vibrant communities</li>
              <li>Creating high-quality buildings and places</li>
              <li>Ensuring adequate housing supply</li>
              <li>Supporting health, social and cultural well-being</li>
              <li>Promoting safe and accessible environments</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Sustainable Design and Construction</h2>
          <p>Sustainable design is crucial in modern development. Key aspects include:</p>
          <ul className="list-disc ml-6">
            <li>Energy efficiency and renewable energy</li>
            <li>Sustainable materials and construction methods</li>
            <li>Water conservation and management</li>
            <li>Waste reduction and recycling</li>
            <li>Biodiversity enhancement</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Assessment Methods</h2>
          <p>Several methods are used to assess sustainability in development:</p>
          <ul className="list-disc ml-6">
            <li><a href="https://www.breeam.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BREEAM</a> - Building Research Establishment Environmental Assessment Method</li>
            <li><a href="https://www.homequalitymark.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Home Quality Mark</a> - For new homes</li>
            <li><a href="https://www.gov.uk/guidance/climate-change" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Environmental Impact Assessment</a> - For larger developments</li>
          </ul>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
            <ul className="space-y-2">
              <li>• <a href="https://www.ukgbc.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">UK Green Building Council</a></li>
              <li>• <a href="https://www.sustainablebuild.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Sustainable Build UK</a></li>
              <li>• <a href="https://www.theccc.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Committee on Climate Change</a></li>
              <li>• <a href="https://www.gov.uk/government/organisations/environment-agency" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Environment Agency</a></li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default SustainableDevelopment;