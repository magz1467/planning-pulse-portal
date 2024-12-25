import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        const response = await supabase.functions.invoke('verify-email', {
          body: { email, token }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        setStatus('success');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setError(error.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        {status === 'verifying' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-green-600">Email Verified!</h1>
            <p className="text-gray-600 mb-6">Thank you for verifying your email. You're now subscribed to our newsletter.</p>
            <Link to="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1>
            <p className="text-gray-600 mb-6">{error || 'There was a problem verifying your email. The link may have expired or is invalid.'}</p>
            <Link to="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;