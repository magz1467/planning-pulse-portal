import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Mission } from "@/components/Mission";
import { Services } from "@/components/Services";
import { GetInTouch } from "@/components/GetInTouch";

const Index = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <Hero />
        <Features />
        <Mission />
        <Services />
        <GetInTouch />
      </div>
      <Footer />
    </>
  );
};

export default Index;