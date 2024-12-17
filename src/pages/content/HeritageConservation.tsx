import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";
import { PlanningCTA } from "@/components/content/PlanningCTA";

const HeritageConservation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8 border-b pb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Heritage and Conservation in Planning</h1>
            <p className="text-lg text-gray-600 mt-2">Preserving our architectural and cultural heritage</p>
          </div>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-xl text-gray-700">Heritage and conservation areas play a vital role in preserving the UK's historical and cultural legacy. This guide explains how the planning system protects and enhances our built heritage.</p>
          
          <div className="mt-12 space-y-12">
            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold mb-4">Listed Buildings</h2>
              <p>Listed buildings are structures of special architectural or historic interest. Visit <a href="https://historicengland.org.uk/listing/what-is-designation/listed-buildings/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Historic England's Listed Buildings Guide</a> to learn more.</p>
              
              <div className="mt-6">
                <h3 className="text-xl font-medium mb-4">Listing Grades</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-primary font-semibold">Grade I</span>
                    <span>Buildings of exceptional interest (2.5% of listed buildings)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary font-semibold">Grade II*</span>
                    <span>Particularly important buildings (5.8% of listed buildings)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary font-semibold">Grade II</span>
                    <span>Buildings of special interest (91.7% of listed buildings)</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold mb-4">Conservation Areas</h2>
              <p>Conservation areas are designated to preserve and enhance areas of special architectural or historic interest. Learn about their protection on the <a href="https://www.gov.uk/government/publications/conservation-area-designation-appraisal-and-management" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Government's Conservation Area guidance</a>.</p>
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold mb-4">Key Considerations</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Listed Building Consent</h3>
                  <p>Required for:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Alterations affecting character</li>
                    <li>Extensions</li>
                    <li>Demolition</li>
                    <li>Internal changes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">2. Conservation Area Controls</h3>
                  <p>Additional planning controls including:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Demolition restrictions</li>
                    <li>Tree protection</li>
                    <li>Design requirements</li>
                    <li>Advertisement controls</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">3. Heritage Statements</h3>
                  <p>Required documentation explaining:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>Historical significance</li>
                    <li>Impact assessment</li>
                    <li>Mitigation measures</li>
                    <li>Design justification</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl mt-12 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Authoritative Sources</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://historicengland.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Historic England</a> - Official source for heritage protection
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.spab.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Society for the Protection of Ancient Buildings</a> - Technical advice and training
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://ihbc.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Institute of Historic Building Conservation</a> - Professional body for conservation specialists
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.heritagegateway.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Heritage Gateway</a> - Online database of historic environment records
              </li>
            </ul>
          </div>

          <PlanningCTA />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default HeritageConservation;