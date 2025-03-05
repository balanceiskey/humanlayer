'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuthSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    // Fetch token status from the server
    const fetchTokenStatus = async () => {
      try {
        const response = await fetch('/api/auth/slack/status');
        const data = await response.json();
        
        if (data.hasToken) {
          setTeamName(data.teamName);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching token status:', error);
        setIsLoading(false);
      }
    };
    
    fetchTokenStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLoading ? 'Connecting to Slack...' : 'Successfully Connected to Slack!'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-green-600 dark:text-green-400 text-lg mb-2">✓ Authentication successful</p>
              {teamName && (
                <p className="text-gray-600 dark:text-gray-300">
                  Connected to workspace: <strong>{teamName}</strong>
                </p>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your Slack workspace is now connected to the Pizza App. You can now use Slack for human approvals when ordering pizzas.
            </p>
            
            <div className="flex justify-center">
              <Link 
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
