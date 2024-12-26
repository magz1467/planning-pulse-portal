import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Account Created Successfully!</h1>
          <p className="text-gray-600">
            Thank you for joining us. You will be automatically redirected to the home page in a few seconds.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Continue to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;