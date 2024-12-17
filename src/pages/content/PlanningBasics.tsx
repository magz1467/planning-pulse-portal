import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen } from "lucide-react";
import { PlanningCTA } from "@/components/content/PlanningCTA";

const PlanningBasics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8 border-b pb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Understanding UK Planning Permission</h1>
            <p className="text-lg text-gray-600 mt-2">Your comprehensive guide to the planning system</p>
          </div>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-xl text-gray-700">Planning permission is a fundamental aspect of the UK's development control system. This comprehensive guide explains everything you need to know about planning permission and how it affects property development in the United Kingdom.</p>
          
          <div className="mt-12 space-y-12">
            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold mb-4">What is Planning Permission?</h2>
              <p>Planning permission is the formal approval needed from your local authority for carrying out development or making material changes to buildings or land. It's designed to control inappropriate development and protect both the built and natural environment.</p>
            </section>
            
            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold mb-4">Types of Planning Permission</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Full Planning Permission</h3>
                  <p>This is a detailed application where you need to provide complete plans of what you want to build. Once approved, you can start work immediately, subject to any conditions. Learn more at the <a href="https://www.planningportal.co.uk/permission/common-projects" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal's Common Projects guide</a>.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">2. Outline Planning Permission</h3>
                  <p>This establishes whether a type of development would be acceptable in principle. Detailed matters are reserved for later approval. Visit <a href="https://www.gov.uk/planning-permission-england-wales" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GOV.UK's Planning Permission Guide</a> for more information.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">3. Permitted Development Rights</h3>
                  <p>These rights allow certain building works and changes of use to be carried out without having to make a planning application. Check the <a href="https://www.planningportal.co.uk/permission/common-projects/permitted-development-rights" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Permitted Development Rights guide</a>.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold mb-4">The Application Process</h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="font-bold text-primary">1.</span>
                  <div>
                    <strong>Pre-application advice</strong> - Many local authorities offer this service to discuss your proposals before submitting a formal application.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">2.</span>
                  <div>
                    <strong>Prepare your application</strong> - Including detailed plans, supporting documents, and the correct fee.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">3.</span>
                  <div>
                    <strong>Submit and validate</strong> - Your local authority will check if all required information is provided.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">4.</span>
                  <div>
                    <strong>Consultation</strong> - Neighbors and relevant parties are notified and can comment.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">5.</span>
                  <div>
                    <strong>Decision</strong> - Usually within 8 weeks for minor applications, 13 weeks for major ones.
                  </div>
                </li>
              </ol>
            </section>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl mt-12 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Further Resources</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.planningportal.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal</a> - The UK Government's online planning and building regulations resource
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.gov.uk/government/organisations/planning-inspectorate" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Inspectorate</a> - Handles planning appeals and national infrastructure planning applications
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.planningaid.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Aid</a> - Free, independent planning advice for communities and individuals
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

export default PlanningBasics;