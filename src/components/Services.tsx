export const Services = () => {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden">
            <img
              src="/photo-1581091226825-a6a2a5aee158"
              alt="Resident using the platform"
              className="w-full h-48 object-cover"
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
              src="/photo-1486312338219-ce68d2c6f44d"
              alt="Developer reviewing feedback"
              className="w-full h-48 object-cover"
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
              src="/photo-1487058792275-0ad4aaf24ca7"
              alt="Local authority dashboard"
              className="w-full h-48 object-cover"
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