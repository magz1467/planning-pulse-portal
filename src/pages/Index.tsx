import { Suspense, lazy } from 'react';
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import StayUpToDate from "@/components/StayUpToDate";
import { AdminControls } from "@/components/AdminControls";

// Lazy load components that are not immediately visible
const Features = lazy(() => import("@/components/Features"));
const Mission = lazy(() => import("@/components/Mission")); 
const Services = lazy(() => import("@/components/Services"));
const GetInTouch = lazy(() => import("@/components/GetInTouch"));

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full">
        <div className="relative">
          <Hero />
          <AdminControls />
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
            <Features />
          </Suspense>
          <StayUpToDate />
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
            <Mission />
          </Suspense>
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
            <Services />
          </Suspense>
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
            <GetInTouch />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;