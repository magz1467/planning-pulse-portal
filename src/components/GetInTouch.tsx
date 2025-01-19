import { Facebook, Twitter, LinkedIn } from "lucide-react";

const GetInTouch = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
      <p className="text-gray-600 mb-4">
        We would love to hear from you! Reach out to us through any of the platforms below.
      </p>
      <div className="flex space-x-4 mt-4">
        <a 
          href="https://www.facebook.com/profile.php?id=61572261991963" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:text-primary-dark"
        >
          <Facebook className="w-6 h-6" />
        </a>
        <a 
          href="https://twitter.com/yourprofile" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:text-primary-dark"
        >
          <Twitter className="w-6 h-6" />
        </a>
        <a 
          href="https://linkedin.com/in/yourprofile" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:text-primary-dark"
        >
          <LinkedIn className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default GetInTouch;