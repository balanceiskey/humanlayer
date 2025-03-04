'use client';

import { useState, useEffect } from 'react';

interface TestResult {
  valid: boolean;
  error?: string;
  messageSent?: boolean;
  channelName?: string;
}

export default function SlackControls() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTestToken = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const storedToken = localStorage.getItem('slackToken');
      let token = null;
      
      if (storedToken) {
        try {
          const parsedToken = JSON.parse(storedToken);
          token = parsedToken.accessToken;
        } catch (e) {
          console.error('Error parsing stored token:', e);
        }
      }
      
      const response = await fetch('/api/auth/slack/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: token ? JSON.stringify({ token }) : '{}'
      });
      
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ valid: false, error: 'An unexpected error occurred' });
    } finally {
      setTesting(false);
    }
  };

  const handleClearToken = async () => {
    if (confirm('Are you sure you want to disconnect from Slack?')) {
      setClearing(true);
      try {
        await fetch('/api/auth/slack/clear', {
          method: 'POST'
        });
        localStorage.removeItem('slackToken');
        window.location.reload();
      } catch (error) {
        alert('Failed to clear token');
        setClearing(false);
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTestToken}
          disabled={testing}
          className={`px-4 py-2 rounded disabled:opacity-50 ${
            testResult && testResult.valid 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : testResult && !testResult.valid
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {testing 
            ? 'Testing...' 
            : testResult && testResult.valid 
              ? 'Connection Successful' 
              : 'Test Connection'}
        </button>
        <button
          onClick={handleClearToken}
          disabled={clearing}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {clearing ? 'Disconnecting...' : 'Disconnect from Slack'}
        </button>
      </div>

      {testResult && (
        <div className={`p-3 rounded ${testResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {testResult.valid ? (
            <div>
              <p>✓ Connection successful! Your Slack token is valid.</p>
              {testResult.messageSent ? (
                <p className="mt-2">✓ Test message successfully sent to #{testResult.channelName} channel.</p>
              ) : (
                <p className="mt-2">⚠️ Could not send test message: {testResult.error}</p>
              )}
            </div>
          ) : (
            <p>✗ Connection failed: {testResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
