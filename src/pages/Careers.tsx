import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

const Careers = () => {
  const openRoles = [
    {
      title: "Junior Operations Manager",
      id: 1,
    },
    {
      title: "Enterprise Sales Manager",
      id: 2,
    },
    {
      title: "Founder's Associate",
      id: 3,
    },
    {
      title: "Marketing Lead",
      id: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Careers at PlanningPulse</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
          <p className="text-lg text-gray-700 max-w-3xl">
            At PlanningPulse, we're revolutionizing how communities engage with urban planning. 
            We're an innovative company that combines cutting-edge technology with urban development expertise 
            to create solutions that matter. Our team is passionate about making cities more livable, 
            planning more accessible, and communities more connected.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Open Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <button className="text-primary hover:text-primary-dark transition-colors">
                    View Role →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;