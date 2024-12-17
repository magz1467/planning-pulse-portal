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
          <p className="lead">Sustainable development is at the heart of the planning system in the UK. This guide explores how sustainability principles are incorporated into planning decisions.</p>
          
          <h2>What is Sustainable Development?</h2>
          <p>Sustainable development in planning aims to ensure that development meets the needs of the present without compromising future generations' ability to meet their own needs.</p>
          
          <h2>Key Principles</h2>
          <ul>
            <li>Environmental Protection</li>
            <li>Economic Growth</li>
            <li>Social Progress</li>
            <li>Resource Efficiency</li>
          </ul>
          
          <h2>Further Reading</h2>
          <ul>
            <li><a href="https://www.ukgbc.org/" target="_blank" rel="noopener noreferrer">UK Green Building Council</a></li>
            <li><a href="https://www.breeam.com/" target="_blank" rel="noopener noreferrer">BREEAM - Building Research Establishment</a></li>
            <li><a href="https://www.sustainablebuild.co.uk/" target="_blank" rel="noopener noreferrer">Sustainable Build UK</a></li>
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default SustainableDevelopment;