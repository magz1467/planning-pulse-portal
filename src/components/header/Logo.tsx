import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <span className="text-[#af5662] font-playfair text-xl font-bold">NimbyGram</span>
    </Link>
  );
};