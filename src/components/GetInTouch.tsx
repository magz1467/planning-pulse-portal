export const GetInTouch = () => {
  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              If you are a developer or a council, get in touch to hear more about our partnership options.
            </p>
            <a 
              href="mailto:contact@planningpulse.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};