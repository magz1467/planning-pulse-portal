import { AreaUpdatesCard } from "./stay-up-to-date/AreaUpdatesCard";
import { NewsletterCard } from "./stay-up-to-date/NewsletterCard";
import { SocialMediaCard } from "./stay-up-to-date/SocialMediaCard";

const StayUpToDate = () => {
  return (
    <div className="bg-[#f3f3f3] py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Stay Up to Date</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AreaUpdatesCard />
            <NewsletterCard />
            <SocialMediaCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayUpToDate;