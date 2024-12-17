import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";

const HeritageConservation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Heritage and Conservation in Planning</h1>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-lg text-gray-700">Heritage and conservation areas play a vital role in preserving the UK's historical and cultural legacy. This guide explains how the planning system protects and enhances our built heritage.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Listed Buildings</h2>
          <p>Listed buildings are structures of special architectural or historic interest. Visit <a href="https://historicengland.org.uk/listing/what-is-designation/listed-buildings/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Historic England's Listed Buildings Guide</a> to learn more.</p>
          
          <div className="ml-6">
            <h3 className="text-xl font-medium mt-4 mb-2">Listing Grades</h3>
            <ul className="list-disc ml-6">
              <li><strong>Grade I</strong> - Buildings of exceptional interest (2.5% of listed buildings)</li>
              <li><strong>Grade II*</strong> - Particularly important buildings (5.8% of listed buildings)</li>
              <li><strong>Grade II</strong> - Buildings of special interest (91.7% of listed buildings)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Conservation Areas</h2>
          <p>Conservation areas are designated to preserve and enhance areas of special architectural or historic interest. Learn about their protection on the <a href="https://www.gov.uk/government/publications/conservation-area-designation-appraisal-and-management" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Government's Conservation Area guidance</a>.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Key Considerations</h2>
          <div className="ml-6">
            <h3 className="text-xl font-medium mt-4 mb-2">1. Listed Building Consent</h3>
            <p>Required for:</p>
            <ul className="list-disc ml-6">
              <li>Alterations affecting character</li>
              <li>Extensions</li>
              <li>Demolition</li>
              <li>Internal changes</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">2. Conservation Area Controls</h3>
            <p>Additional planning controls including:</p>
            <ul className="list-disc ml-6">
              <li>Demolition restrictions</li>
              <li>Tree protection</li>
              <li>Design requirements</li>
              <li>Advertisement controls</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">3. Heritage Statements</h3>
            <p>Required documentation explaining:</p>
            <ul className="list-disc ml-6">
              <li>Historical significance</li>
              <li>Impact assessment</li>
              <li>Mitigation measures</li>
              <li>Design justification</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Archaeological Considerations</h2>
          <p>Development affecting archaeological remains requires careful consideration. Visit the <a href="https://www.archaeologists.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chartered Institute for Archaeologists</a> for guidance.</p>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Authoritative Sources</h2>
            <ul className="space-y-2">
              <li>• <a href="https://historicengland.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Historic England</a> - Official source for heritage protection</li>
              <li>• <a href="https://www.spab.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Society for the Protection of Ancient Buildings</a> - Technical advice and training</li>
              <li>• <a href="https://ihbc.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Institute of Historic Building Conservation</a> - Professional body for conservation specialists</li>
              <li>• <a href="https://www.heritagegateway.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Heritage Gateway</a> - Online database of historic environment records</li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default HeritageConservation;