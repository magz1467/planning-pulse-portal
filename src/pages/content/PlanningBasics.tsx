import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen } from "lucide-react";

const PlanningBasics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Understanding UK Planning Permission</h1>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead">Planning permission is a crucial part of the UK's development control system. This guide explains the basics of planning permission and how it affects property development in the United Kingdom.</p>
          
          <h2>What is Planning Permission?</h2>
          <p>Planning permission is the formal approval needed from your local authority to construct new buildings, make major changes to existing buildings, or change the use of a building or piece of land.</p>
          
          <h2>Types of Planning Permission</h2>
          <ul>
            <li>Full Planning Permission</li>
            <li>Outline Planning Permission</li>
            <li>Permitted Development Rights</li>
          </ul>
          
          <h2>Useful Resources</h2>
          <ul>
            <li><a href="https://www.planningportal.co.uk/" target="_blank" rel="noopener noreferrer">Planning Portal - Official Planning Website for England and Wales</a></li>
            <li><a href="https://www.gov.uk/planning-permission" target="_blank" rel="noopener noreferrer">UK Government Planning Permission Guide</a></li>
            <li><a href="https://www.rtpi.org.uk/" target="_blank" rel="noopener noreferrer">Royal Town Planning Institute</a></li>
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PlanningBasics;