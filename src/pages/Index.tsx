import { triggerDevelopmentsUpdate } from "@/utils/triggerUpdate";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Mission from "@/components/Mission";
import Stats from "@/components/Stats";
import GetInTouch from "@/components/GetInTouch";
import StayUpToDate from "@/components/StayUpToDate";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <Features />
        <Services />
        <Mission />
        <Stats />
        <GetInTouch />
        <StayUpToDate />
        
        {/* Add update trigger button - you can remove this after initial data load */}
        <div className="container mx-auto py-4">
          <Button 
            onClick={() => triggerDevelopmentsUpdate()}
            variant="outline"
          >
            Trigger Developments Update
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
