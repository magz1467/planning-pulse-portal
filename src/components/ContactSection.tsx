import { Mail } from "lucide-react";

type ContactSectionProps = {
  title: string;
  description: string;
  email: string;
};

export const ContactSection = ({ title, description, email }: ContactSectionProps) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a 
        href={`mailto:${email}`}
        className="inline-flex items-center text-primary hover:text-primary-dark"
      >
        <Mail className="w-4 h-4 mr-2" />
        {email}
      </a>
    </div>
  );
};