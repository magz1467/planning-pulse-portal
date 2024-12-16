import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/privacy#terms");
  }, [navigate]);

  return null;
};

export default Terms;