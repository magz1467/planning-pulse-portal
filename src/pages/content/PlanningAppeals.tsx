import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

const PlanningAppeals = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Info className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Planning Appeals Process</h1>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead">Understanding the planning appeals process is crucial for anyone involved in development. This guide explains how to appeal planning decisions and what to expect.</p>
          
          <h2>The Appeals Process</h2>
          <p>If your planning application is refused, you have the right to appeal. The Planning Inspectorate handles appeals independently from local authorities.</p>
          
          <h2>Types of Appeals</h2>
          <ul>
            <li>Written Representations</li>
            <li>Hearings</li>
            <li>Public Inquiries</li>
          </ul>
          
          <h2>Essential Resources</h2>
          <ul>
            <li><a href="https://www.gov.uk/appeal-planning-decision" target="_blank" rel="noopener noreferrer">Planning Appeals - UK Government</a></li>
            <li><a href="https://www.planninginspectorate.gov.uk/" target="_blank" rel="noopener noreferrer">Planning Inspectorate</a></li>
            <li><a href="https://www.planningaid.co.uk/" target="_blank" rel="noopener noreferrer">Planning Aid</a></li>
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PlanningAppeals;