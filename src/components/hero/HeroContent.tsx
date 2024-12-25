import { Stats } from "@/components/Stats";
import { SearchForm } from "@/components/SearchForm";
import { HeroTitle } from "./HeroTitle";
import { HeroSubtitle } from "./HeroSubtitle";

export const HeroContent = () => {
  return (
    <div className="space-y-3">
      <HeroTitle />
      <HeroSubtitle />
      <div className="bg-white rounded-xl shadow-sm p-2">
        <Stats />
      </div>
      <div className="bg-white rounded-xl shadow-sm">
        <SearchForm />
      </div>
    </div>
  );
};