const Services = () => {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
            <img
              src="/lovable-uploads/bbc0ab46-b246-4a14-b768-a9ee0b4cd8e0.png"
              alt="Resident using the platform"
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">For Residents</h3>
              <p className="text-gray-600">
                Easily comment for free on local developments. Stay informed and have your say on changes in your community.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
            <img
              src="/lovable-uploads/00c352b2-8697-4425-a649-17b25f1c6db3.png"
              alt="Developer reviewing feedback"
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">For Developers</h3>
              <p className="text-gray-600">
                Get feedback on your project before decision day. Easily see other developments in the area and understand community sentiment.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
            <img
              src="/lovable-uploads/ea10c55a-9324-434a-8bbf-c2de0a2f9b25.png"
              alt="Local authority dashboard"
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">For Local Authorities</h3>
              <p className="text-gray-600">
                Automate and accelerate your planning process. Streamline communication between residents and developers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;