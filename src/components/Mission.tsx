import Image from "@/components/ui/image";

const Mission = () => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  The UK planning system has long been burdened by slow processes and limited transparency. With average application decisions taking 8-13 weeks, the need for innovation is clear.
                </p>
                <p className="text-lg">
                  Our platform revolutionizes this outdated system by creating a seamless digital bridge between residents, developers, and local authorities. Through data-driven insights and transparent processes, we're building a future where planning decisions are made faster, smarter, and with genuine community input.
                </p>
              </div>
              <div className="flex items-center justify-center h-full">
                <Image 
                  src="/lovable-uploads/ecdf4ccf-de30-4de8-a738-6470bdc2d41c.png"
                  alt="Modern sustainable home design" 
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