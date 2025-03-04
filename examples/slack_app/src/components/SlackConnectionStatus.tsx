'use client';

import { useState, useEffect } from 'react';
import SlackControls from './SlackControls';

interface SlackConnectionStatusProps {
  initialHasToken: boolean;
  initialTeamName: string | null;
}

export default function SlackConnectionStatus({ 
  initialHasToken, 
  initialTeamName 
}: SlackConnectionStatusProps) {
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(initialHasToken);
  const [teamName, setTeamName] = useState(initialTeamName || 'Unknown');

  // Only run on client after hydration is complete
  useEffect(() => {
    // Check for token in localStorage
    try {
      const storedToken = localStorage.getItem('slackToken');
      if (storedToken) {
        const token = JSON.parse(storedToken);
        setHasToken(true);
        setTeamName(token.teamName || 'Unknown');
      }
    } catch (error) {
      console.error('Error checking localStorage for token:', error);
    }
    
    // Mark component as mounted after first render
    setMounted(true);
  }, []);

  // During SSR and first render, return the server state to prevent hydration mismatch
  if (!mounted) {
    return initialHasToken ? (
      <div className="mb-8 p-4 border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-300">
          Slack Connected
        </h2>
        <p className="mb-4">
          Your app is connected to the <strong>{initialTeamName || "Unknown"}</strong> Slack workspace.
        </p>
        {/* Controls will be added after hydration */}
        <div className="h-16"></div>
      </div>
    ) : null;
  }

  // After mounted, render based on client state
  if (!hasToken) {
    return null;
  }

  return (
    <div className="mb-8 p-4 border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-300">
        Slack Connected
      </h2>
      <p className="mb-4">
        Your app is connected to the <strong>{teamName}</strong> Slack workspace.
      </p>
      <SlackControls />
    </div>
  );
}
