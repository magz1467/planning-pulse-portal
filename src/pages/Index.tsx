import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Mission } from "@/components/Mission";
import { Services } from "@/components/Services";
import { GetInTouch } from "@/components/GetInTouch";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full">
        <div className="relative">
          <Hero />
          <Features />
          <Mission />
          <Services />
          <GetInTouch />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;