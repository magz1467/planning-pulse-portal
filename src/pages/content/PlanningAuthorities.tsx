import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2 } from "lucide-react";
import { PlanningCTA } from "@/components/content/PlanningCTA";

const PlanningAuthorities = () => {
  const authorities = [
    {
      region: "London",
      councils: [
        "City of London Corporation",
        "London Borough of Camden",
        "London Borough of Greenwich",
        "London Borough of Hackney",
        "London Borough of Hammersmith and Fulham"
      ]
    },
    {
      region: "South East",
      councils: [
        "Brighton and Hove City Council",
        "Kent County Council",
        "Surrey County Council",
        "West Sussex County Council",
        "East Sussex County Council"
      ]
    },
    {
      region: "North West",
      councils: [
        "Manchester City Council",
        "Liverpool City Council",
        "Cheshire East Council",
        "Lancashire County Council",
        "Cumbria County Council"
      ]
    },
    {
      region: "Scotland",
      councils: [
        "City of Edinburgh Council",
        "Glasgow City Council",
        "Aberdeen City Council",
        "Dundee City Council",
        "Highland Council"
      ]
    },
    {
      region: "Wales",
      councils: [
        "Cardiff Council",
        "Swansea Council",
        "Newport City Council",
        "Wrexham County Borough Council",
        "Flintshire County Council"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6 md:px-8 lg:px-12 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8 border-b pb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Directory of UK Planning Authorities</h1>
            <p className="text-lg text-gray-600 mt-2">Find your local planning authority and start your planning journey</p>
          </div>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-xl text-gray-700">
            Find your local planning authority from our comprehensive directory of UK planning authorities. 
            These organizations are responsible for making decisions on planning applications and developing local planning policies.
          </p>

          <div className="mt-12 space-y-8">
            {authorities.map((authority, index) => (
              <section key={index} className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {authority.region}
                </h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {authority.councils.map((council, councilIndex) => (
                    <li key={councilIndex} className="flex items-center gap-3 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary/20 rounded-full"></span>
                      {council}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="bg-gray-50 p-8 rounded-xl mt-12 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Additional Resources</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.gov.uk/find-local-council" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Find your local council (GOV.UK)</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.planningportal.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">•</span>
                <a href="https://www.rtpi.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Royal Town Planning Institute</a>
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

export default PlanningAuthorities;