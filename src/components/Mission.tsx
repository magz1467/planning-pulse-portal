import Image from "@/components/ui/image";

const Mission = () => {
  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-accent">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground font-playfair">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-foreground font-sans">
                <p className="text-lg">
                  The UK planning system has long been burdened by slow processes and limited transparency. With average application decisions taking 8-13 weeks, the need for innovation is clear.
                </p>
                <p className="text-lg">
                  Our platform revolutionizes this outdated system by creating a seamless digital bridge between residents, developers, and local authorities. Through data-driven insights and transparent processes, we're building a future where planning decisions are made faster, smarter, and with genuine community input.
                </p>
              </div>
              <div className="flex items-center justify-center h-full">
                <Image 
                  src="/lovable-uploads/f828cab7-3a4b-4e5b-ae45-310b554061d7.png"
                  alt="Group of diverse professionals standing in front of a traditional British building" 
                  className="rounded-lg shadow-xl w-full h-[400px] object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;