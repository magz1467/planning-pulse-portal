import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2 } from "lucide-react";

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
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Directory of UK Planning Authorities</h1>
        </div>
        
        <article className="prose lg:prose-xl max-w-none">
          <p className="lead text-lg text-gray-700">
            Find your local planning authority from our comprehensive directory of UK planning authorities. 
            These organizations are responsible for making decisions on planning applications and developing local planning policies.
          </p>

          <div className="mt-8 space-y-8">
            {authorities.map((authority, index) => (
              <section key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-primary mb-4">{authority.region}</h2>
                <ul className="grid gap-3">
                  {authority.councils.map((council, councilIndex) => (
                    <li key={councilIndex} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary/20 rounded-full"></span>
                      {council}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Additional Resources</h2>
            <ul className="space-y-2">
              <li>• <a href="https://www.gov.uk/find-local-council" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Find your local council (GOV.UK)</a></li>
              <li>• <a href="https://www.planningportal.co.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Planning Portal</a></li>
              <li>• <a href="https://www.rtpi.org.uk/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Royal Town Planning Institute</a></li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PlanningAuthorities;