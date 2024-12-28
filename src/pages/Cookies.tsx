import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="hidden md:block">
            <nav className="flex flex-col space-y-2">
              <a href="#what-are-cookies" className="text-sm hover:text-primary">What Are Cookies</a>
              <a href="#how-we-use" className="text-sm hover:text-primary">How We Use Cookies</a>
              <a href="#types" className="text-sm hover:text-primary">Types of Cookies</a>
              <a href="#managing" className="text-sm hover:text-primary">Managing Cookies</a>
              <a href="#changes" className="text-sm hover:text-primary">Changes to Policy</a>
            </nav>
          </div>

          <ScrollArea className="h-[800px] rounded-md border p-6">
            <section id="what-are-cookies" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
              
              <p className="text-sm text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and provide useful information to website owners.
              </p>
            </section>

            <Separator className="my-8" />

            <section id="how-we-use" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our website and services</li>
                <li>Provide you with relevant planning application updates</li>
                <li>Keep your account secure</li>
              </ul>
            </section>

            <Separator className="my-8" />

            <section id="types" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, 
                    network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    We use analytics cookies to help us understand how you use our website, discover errors, and determine which pages people visit most frequently.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Functionality Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    These cookies allow the website to remember choices you make (such as your preferred postcode or login details) 
                    and provide enhanced features.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            <section id="managing" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Most web browsers allow you to manage cookies through their settings preferences. 
                However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">How to manage cookies in major browsers:</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                  <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
                  <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                  <li>Safari: Preferences → Privacy → Cookies and website data</li>
                  <li>Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
              </div>
            </section>

            <Separator className="my-8" />

            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Cookie Policy</h2>
              <p className="text-sm text-muted-foreground">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new 
                Cookie Policy on this page and updating the "Last updated" date at the top of this policy.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                For more information about how we use cookies or if you have any questions about this Cookie Policy, 
                please contact us at privacy@planningpulse.com
              </p>
            </section>
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;