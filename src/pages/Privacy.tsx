import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy & Terms of Service</h1>
        
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="hidden md:block">
            <nav className="flex flex-col space-y-2">
              <a href="#privacy" className="text-sm hover:text-primary">Privacy Policy</a>
              <a href="#terms" className="text-sm hover:text-primary">Terms of Service</a>
              <a href="#cookies" className="text-sm hover:text-primary">Cookie Policy</a>
              <a href="#data" className="text-sm hover:text-primary">Data Protection</a>
            </nav>
          </div>

          <ScrollArea className="h-[800px] rounded-md border p-6">
            <section id="privacy" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
                  <p className="text-sm text-muted-foreground">
                    PlanningPulse ("we", "our", or "us") is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Information We Collect</h3>
                  <p className="text-sm text-muted-foreground">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                    <li>Name and contact information</li>
                    <li>Planning application details</li>
                    <li>Property information</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. How We Use Your Information</h3>
                  <p className="text-sm text-muted-foreground">
                    We use your information to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                    <li>Process planning applications</li>
                    <li>Communicate updates about your applications</li>
                    <li>Improve our services</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section id="terms" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
              <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    By accessing and using PlanningPulse, you accept and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. User Obligations</h3>
                  <p className="text-sm text-muted-foreground">You agree to:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                    <li>Provide accurate information</li>
                    <li>Maintain the confidentiality of your account</li>
                    <li>Use the service in compliance with all applicable laws</li>
                    <li>Not misuse or attempt to circumvent our systems</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Intellectual Property</h3>
                  <p className="text-sm text-muted-foreground">
                    All content, features, and functionality of PlanningPulse are owned by us and are protected by UK and international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Cookie Policy</h2>
              <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. What Are Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and allow certain features to work.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. How We Use Cookies</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                    <li>Essential cookies for site functionality</li>
                    <li>Analytics cookies to understand usage</li>
                    <li>Preference cookies to remember your settings</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section id="data" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
              <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Your Rights</h3>
                  <p className="text-sm text-muted-foreground">Under the UK GDPR, you have the right to:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                    <li>Access your personal data</li>
                    <li>Rectify inaccurate data</li>
                    <li>Request erasure of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Data portability</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Data Security</h3>
                  <p className="text-sm text-muted-foreground">
                    We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, access controls, and regular security assessments.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Contact Us</h3>
                  <p className="text-sm text-muted-foreground">
                    For any questions about our privacy practices or to exercise your rights, please contact our Data Protection Officer at:
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Email: dpo@planningpulse.com<br />
                    Address: 123 Planning Street, London, EC1A 1BB<br />
                    Phone: +44 (0)20 1234 5678
                  </p>
                </div>
              </div>
            </section>
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
