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
          <p className="lead">Heritage and conservation areas play a vital role in preserving the UK's historical and cultural legacy through the planning system.</p>
          
          <h2>Conservation Areas</h2>
          <p>Conservation areas are designated to preserve and enhance areas of special architectural or historic interest. Special planning controls apply in these areas.</p>
          
          <h2>Key Considerations</h2>
          <ul>
            <li>Listed Buildings</li>
            <li>Conservation Area Consent</li>
            <li>Heritage Statements</li>
            <li>Archaeological Assessments</li>
          </ul>
          
          <h2>Authoritative Sources</h2>
          <ul>
            <li><a href="https://historicengland.org.uk/" target="_blank" rel="noopener noreferrer">Historic England</a></li>
            <li><a href="https://www.spab.org.uk/" target="_blank" rel="noopener noreferrer">Society for the Protection of Ancient Buildings</a></li>
            <li><a href="https://ihbc.org.uk/" target="_blank" rel="noopener noreferrer">Institute of Historic Building Conservation</a></li>
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default HeritageConservation;