import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>
        
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="hidden md:block">
            <nav className="flex flex-col space-y-2">
              <a href="#commitment" className="text-sm hover:text-primary">Our Commitment</a>
              <a href="#standards" className="text-sm hover:text-primary">Standards</a>
              <a href="#compatibility" className="text-sm hover:text-primary">Compatibility</a>
              <a href="#contact" className="text-sm hover:text-primary">Contact Us</a>
            </nav>
          </div>

          <ScrollArea className="h-[800px] rounded-md border p-6">
            <section id="commitment" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Commitment to Accessibility</h2>
              <p className="text-muted-foreground mb-4">
                PlanningPulse is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <Separator className="my-8" />

            <section id="standards" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Standards</h2>
              <p className="text-muted-foreground mb-4">
                We aim to meet WCAG 2.1 AA standards, which is recommended by the UK Government Digital Service (GDS). This includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Ensuring sufficient colour contrast across our platform</li>
                <li>Providing text alternatives for non-text content</li>
                <li>Making all functionality available from a keyboard</li>
                <li>Providing clear navigation mechanisms</li>
                <li>Making content adaptable and assistive technology-friendly</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section id="compatibility" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Compatibility with Assistive Technologies</h2>
              <p className="text-muted-foreground mb-4">
                PlanningPulse is designed to be compatible with the following:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Screen readers (including NVDA and JAWS)</li>
                <li>Screen magnification tools</li>
                <li>Speech recognition software</li>
                <li>Keyboard-only navigation</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We regularly test our platform with various assistive technologies to ensure compatibility.
              </p>
            </section>

            <Separator className="my-8" />

            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Contact Us About Accessibility</h2>
              <p className="text-muted-foreground mb-4">
                We welcome your feedback on the accessibility of PlanningPulse. Please let us know if you encounter accessibility barriers:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: accessibility@planningpulse.com</p>
                <p>Phone: +44 (0)20 1234 5678</p>
                <p>Address: 123 Planning Street, London, EC1A 1BB</p>
              </div>
              <p className="text-muted-foreground mt-4">
                We aim to respond to accessibility feedback within 2 business days.
              </p>
            </section>

            <Separator className="my-8" />

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Formal Assessment</h2>
              <p className="text-muted-foreground mb-4">
                This statement was created on {new Date().toLocaleDateString()} following an internal accessibility assessment. We regularly review and update this statement when new content or functionality is deployed.
              </p>
            </section>
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accessibility;