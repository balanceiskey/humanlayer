'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuthSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{ teamName: string } | null>(null);

  useEffect(() => {
    // Check if token is already in localStorage (from callback page)
    try {
      const storedToken = localStorage.getItem('slackToken');
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        setTokenInfo({ teamName: parsedToken.teamName || 'Unknown' });
        setIsLoading(false);
        
        // Redirect after a delay
        const timer = setTimeout(() => {
          window.location.href = '/';
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
    
    // If no token in localStorage, fetch from server
    async function checkTokenStatus() {
      try {
        const response = await fetch('/api/auth/slack/status');
        const data = await response.json();
        
        if (data.hasToken) {
          // Store token info in localStorage for client-side persistence
          localStorage.setItem('slackToken', JSON.stringify({
            accessToken: data.accessToken,
            teamId: data.teamId,
            teamName: data.teamName,
            botUserId: data.botUserId
          }));
          setTokenInfo({ teamName: data.teamName || 'Unknown' });
          console.log('Token information stored in localStorage');
        } else {
          console.error('No token found in server response');
          setError('No token found in server response. Authentication may have failed.');
        }
      } catch (error) {
        console.error('Error checking token status:', error);
        setError('Error checking token status. Please try again.');
      } finally {
        setIsLoading(false);
        
        // Redirect after a delay
        const timer = setTimeout(() => {
          window.location.href = '/';
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
    
    checkTokenStatus();
  }, []);

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md mx-auto text-center mt-16">
        <div className={`p-4 rounded-lg mb-6 ${error ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          <h1 className="text-2xl font-bold mb-2">{error ? 'Warning' : 'Success!'}</h1>
          <p>{error || 'Your Slack app has been successfully installed.'}</p>
          {tokenInfo && (
            <p className="mt-2">Connected to workspace: <strong>{tokenInfo.teamName}</strong></p>
          )}
        </div>
        
        <div className="mt-6 text-left p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">What happened?</h2>
          <p className="mb-4">
            The OAuth flow has completed successfully. Your access token has been 
            stored securely in the server's memory and in your browser's localStorage.
          </p>
          <p className="mb-4">
            {isLoading ? 'Syncing token information...' : error ? 'Failed to sync token information.' : 'Token information synced successfully.'}
          </p>
          <p className="mb-4">
            You will be automatically redirected to the home page in 5 seconds, or
            you can click the button below to return immediately.
          </p>
          <p>
            <strong>Note:</strong> This token is stored in your browser's localStorage
            and in server memory. In a production application, tokens would be stored 
            in a database.
          </p>
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
