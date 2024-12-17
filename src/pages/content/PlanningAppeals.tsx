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
          <p className="lead text-lg text-gray-700">Understanding the planning appeals process is crucial for anyone involved in development. This comprehensive guide explains how to appeal planning decisions and what to expect throughout the process.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">The Right to Appeal</h2>
          <p>If your planning application is refused, you have the right to appeal to the <a href="https://www.gov.uk/government/organisations/planning-inspectorate" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Inspectorate</a>. Appeals must be made within specific timeframes:</p>
          <ul className="list-disc ml-6">
            <li>Within 12 weeks of the decision for householder applications</li>
            <li>Within 6 months for most other planning applications</li>
            <li>Within 28 days for enforcement notices</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Appeals</h2>
          <div className="ml-6">
            <h3 className="text-xl font-medium mt-4 mb-2">1. Written Representations</h3>
            <p>The most common and simplest method, where all parties submit their case in writing. Learn more about this process on the <a href="https://www.gov.uk/appeal-planning-decision/appeal-process" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal</a>.</p>

            <h3 className="text-xl font-medium mt-4 mb-2">2. Hearings</h3>
            <p>A more informal round-table discussion led by an Inspector, suitable for cases requiring detailed discussion but not formal cross-examination.</p>

            <h3 className="text-xl font-medium mt-4 mb-2">3. Public Inquiries</h3>
            <p>The most formal method, typically for complex cases or those of significant public interest. Legal representation is common.</p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">The Appeals Process</h2>
          <ol className="list-decimal ml-6 space-y-4">
            <li><strong>Preparation</strong> - Gather all relevant documents and evidence</li>
            <li><strong>Submission</strong> - Submit your appeal via the Planning Inspectorate's website</li>
            <li><strong>Validation</strong> - The Inspectorate checks your appeal is valid</li>
            <li><strong>Representations</strong> - Other parties can make their cases</li>
            <li><strong>Site Visit/Hearing/Inquiry</strong> - Depending on the type of appeal</li>
            <li><strong>Decision</strong> - The Inspector issues their decision</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Costs</h2>
          <p>You can apply for costs if you believe the other party has acted unreasonably. Visit the <a href="https://www.gov.uk/guidance/appeals-award-costs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Government's guidance on costs awards</a> for more information.</p>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Essential Resources</h2>
            <ul className="space-y-2">
              <li>• <a href="https://www.gov.uk/appeal-planning-decision" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Appeals - UK Government</a></li>
              <li>• <a href="https://www.planninginspectorate.gov.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Inspectorate</a></li>
              <li>• <a href="https://www.planningaid.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Aid</a></li>
              <li>• <a href="https://www.rtpi.org.uk/planning-advice/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">RTPI Planning Advice</a></li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PlanningAppeals;