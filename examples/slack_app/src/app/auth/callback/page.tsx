'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Redirect to success page
    router.replace('/auth/success');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Completing Authentication...
        </h1>
        
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <p className="text-center text-gray-600 dark:text-gray-300">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
}
