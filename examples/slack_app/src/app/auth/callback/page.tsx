'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get token from URL parameters
      const tokenParam = searchParams.get('token');
      
      if (tokenParam) {
        // Store token in localStorage
        const tokenData = JSON.parse(decodeURIComponent(tokenParam));
        localStorage.setItem('slackToken', JSON.stringify(tokenData));
        console.log('Token successfully stored in localStorage:', tokenData);
        
        // Redirect to success page
        window.location.href = '/auth/success';
      } else {
        setError('No token found in URL parameters');
        setRedirecting(false);
      }
    } catch (error) {
      console.error('Error storing token:', error);
      setError('Error storing token: ' + (error instanceof Error ? error.message : String(error)));
      setRedirecting(false);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-md mx-auto text-center mt-16">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-6"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md mx-auto text-center mt-16">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">Processing...</h1>
          <p>Storing authentication information and redirecting...</p>
        </div>
      </div>
    </div>
  );
}
