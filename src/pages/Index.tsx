import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import Mission from "@/components/Mission";
import StayUpToDate from "@/components/StayUpToDate";
import GetInTouch from "@/components/GetInTouch";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow border-x border-primary/10">
        <Hero />
        <div className="mb-24">
          <Features />
        </div>
        <div className="mb-24">
          <Services />
        </div>
        <div className="mb-24">
          <Mission />
        </div>
        <div className="mb-24">
          <StayUpToDate />
        </div>
        <GetInTouch />
      </main>
      <Footer />
    </div>
  );
};

export default Index;