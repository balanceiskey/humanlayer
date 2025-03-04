'use client';

import { useState, useEffect } from 'react';
import AddToSlackButton from './AddToSlackButton';

interface SlackInstallSectionProps {
  initialHasToken: boolean;
}

export default function SlackInstallSection({ initialHasToken }: SlackInstallSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(initialHasToken);

  useEffect(() => {
    // Check localStorage for token
    try {
      const hasLocalToken = localStorage.getItem('slackToken') !== null;
      if (hasLocalToken) {
        setHasToken(true);
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
    setMounted(true);
  }, []);

  // Return server state during hydration
  if (!mounted) {
    return (
      <div>
        {!initialHasToken ? (
          <AddToSlackButton />
        ) : (
          <div className="text-green-600 dark:text-green-400">
            ✓ App already installed to workspace
          </div>
        )}
      </div>
    );
  }

  // Return client state after hydration
  return (
    <div>
      {!hasToken ? (
        <AddToSlackButton />
      ) : (
        <div className="text-green-600 dark:text-green-400">
          ✓ App already installed to workspace
        </div>
      )}
    </div>
  );
}
