import { useState } from "react";
import { useToast } from "../use-toast";
import { useNavigate } from "react-router-dom";

export const useSearchState = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [searchPoint, setSearchPoint] = useState<[number, number] | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePostcodeSelect = async (newPostcode: string) => {
    if (!newPostcode) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid postcode to search.",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    setSearchStartTime(Date.now());
    return newPostcode;
  };

  return {
    isSearching,
    setIsSearching,
    searchStartTime,
    setSearchStartTime,
    searchPoint,
    setSearchPoint,
    handlePostcodeSelect,
  };
};