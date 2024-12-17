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
          <p className="lead text-lg text-gray-700">Planning permission is a fundamental aspect of the UK's development control system. This comprehensive guide explains everything you need to know about planning permission and how it affects property development in the United Kingdom.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What is Planning Permission?</h2>
          <p>Planning permission is the formal approval needed from your local authority for carrying out development or making material changes to buildings or land. It's designed to control inappropriate development and protect both the built and natural environment.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Planning Permission</h2>
          <div className="ml-6">
            <h3 className="text-xl font-medium mt-4 mb-2">1. Full Planning Permission</h3>
            <p>This is a detailed application where you need to provide complete plans of what you want to build. Once approved, you can start work immediately, subject to any conditions. Learn more at the <a href="https://www.planningportal.co.uk/permission/common-projects" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal's Common Projects guide</a>.</p>
            
            <h3 className="text-xl font-medium mt-4 mb-2">2. Outline Planning Permission</h3>
            <p>This establishes whether a type of development would be acceptable in principle. Detailed matters are reserved for later approval. Visit <a href="https://www.gov.uk/planning-permission-england-wales" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GOV.UK's Planning Permission Guide</a> for more information.</p>
            
            <h3 className="text-xl font-medium mt-4 mb-2">3. Permitted Development Rights</h3>
            <p>These rights allow certain building works and changes of use to be carried out without having to make a planning application. Check the <a href="https://www.planningportal.co.uk/permission/common-projects/permitted-development-rights" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Permitted Development Rights guide</a>.</p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">The Application Process</h2>
          <ol className="list-decimal ml-6 space-y-4">
            <li><strong>Pre-application advice</strong> - Many local authorities offer this service to discuss your proposals before submitting a formal application.</li>
            <li><strong>Prepare your application</strong> - Including detailed plans, supporting documents, and the correct fee.</li>
            <li><strong>Submit and validate</strong> - Your local authority will check if all required information is provided.</li>
            <li><strong>Consultation</strong> - Neighbors and relevant parties are notified and can comment.</li>
            <li><strong>Decision</strong> - Usually within 8 weeks for minor applications, 13 weeks for major ones.</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Professional Support</h2>
          <p>Consider seeking professional help from:</p>
          <ul className="list-disc ml-6">
            <li><a href="https://www.rtpi.org.uk/find-a-planner/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Royal Town Planning Institute (RTPI) Chartered Planners</a></li>
            <li><a href="https://www.architecture.com/find-an-architect" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Royal Institute of British Architects (RIBA) Architects</a></li>
            <li><a href="https://www.rics.org/find-a-member" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Royal Institution of Chartered Surveyors (RICS) Surveyors</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Common Reasons for Refusal</h2>
          <ul className="list-disc ml-6">
            <li>Overdevelopment of the site</li>
            <li>Impact on neighboring properties</li>
            <li>Design issues</li>
            <li>Highway safety concerns</li>
            <li>Environmental impact</li>
          </ul>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Further Resources</h2>
            <ul className="space-y-2">
              <li>• <a href="https://www.planningportal.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal</a> - The UK Government's online planning and building regulations resource</li>
              <li>• <a href="https://www.gov.uk/government/organisations/planning-inspectorate" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Inspectorate</a> - Handles planning appeals and national infrastructure planning applications</li>
              <li>• <a href="https://www.planningaid.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Aid</a> - Free, independent planning advice for communities and individuals</li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PlanningBasics;