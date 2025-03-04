'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'unknown_error';
  const details = searchParams.get('details');
  
  const errorMessages: Record<string, string> = {
    missing_code: 'Authorization code was missing from the callback.',
    installation_failed: 'Failed to complete the installation process.',
    access_denied: 'Access was denied by the user or the requested scopes are not enabled for this app.',
    invalid_state: 'Security validation failed. Please try again.',
    missing_team_info: 'Could not retrieve workspace information from Slack.',
    slack_api_error: `Slack API returned an error: ${details || 'unknown error'}`,
    unknown_error: 'An unknown error occurred during authentication.',
  };
  
  const errorMessage = errorMessages[error] || errorMessages.unknown_error;
  
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md mx-auto text-center mt-16">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p>{errorMessage}</p>
          <p className="text-sm mt-2">Error code: {error}</p>
          {details && <p className="text-sm mt-1">Details: {details}</p>}
        </div>
        
        <div className="mt-6 text-left p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Verify that your Slack app has the correct scopes enabled in the Slack API dashboard</li>
            <li>Check that your redirect URL is correctly configured in the Slack app settings</li>
            <li>Ensure your environment variables (SLACK_CLIENT_ID, SLACK_CLIENT_SECRET) are set correctly</li>
            <li>Try reinstalling the app to your workspace</li>
            {error === 'missing_team_info' && (
              <li>Make sure you're selecting a workspace during the installation process</li>
            )}
          </ul>
        </div>
        
        <a 
          href="/" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-6"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
