'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AddToSlackButtonProps {
  teamId?: string;
}

export default function AddToSlackButton({ teamId }: AddToSlackButtonProps) {
  const [authUrl, setAuthUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the auth URL from our API
    setLoading(true);
    fetch(`/api/auth/slack${teamId ? `?teamId=${teamId}` : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data.authUrl) {
          setAuthUrl(data.authUrl);
        } else {
          setError('Failed to get authentication URL');
        }
      })
      .catch(err => {
        console.error('Error fetching Slack auth URL:', err);
        setError('Failed to connect to authentication service');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teamId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <a
      href={authUrl}
      className="inline-block"
      title="Add to Slack"
    >
      <Image
        alt="Add to Slack"
        height={40}
        width={139}
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
      />
    </a>
  );
}
