import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Features from "@/components/Features";
import Mission from "@/components/Mission";
import Services from "@/components/Services";
import StayUpToDate from "@/components/StayUpToDate";
import GetInTouch from "@/components/GetInTouch";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full">
        <div className="relative">
          <Hero />
          <Features />
          <StayUpToDate />
          <Mission />
          <Services />
          <GetInTouch />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;