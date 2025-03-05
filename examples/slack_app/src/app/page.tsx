import Image from "next/image";
import SlackConnectionStatus from "@/components/SlackConnectionStatus";
import SlackInstallSection from "@/components/SlackInstallSection";
import { getSlackStatus } from "./actions";

export default async function Home() {
  const slackStatus = await getSlackStatus();

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Slack App Setup Guide</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Follow these steps to create and configure your Slack application
        </p>
      </header>

      <main className="max-w-3xl">
        <SlackConnectionStatus 
          initialHasToken={slackStatus.hasToken} 
          initialTeamName={slackStatus.teamName}
        />

        <div className="space-y-8">
          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Create a Slack App</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">api.slack.com/apps</a></li>
              <li>Click "Create New App" and choose "From scratch"</li>
              <li>Enter an App Name and select your Slack workspace</li>
              <li>Click "Create App"</li>
            </ol>
          </section>

          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Configure App Features</h2>
            <ol className="list-decimal list-inside space-y-3">
              <li>
                <strong>Bot Token Scopes:</strong> Navigate to "OAuth & Permissions" and add scopes:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>chat:write</li>
                  <li>channels:read</li>
                  <li>channels:history</li>
                  <li>incoming-webhook</li>
                </ul>
              </li>
              <li>
                <strong>Event Subscriptions:</strong> Enable events and subscribe to bot events:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>message.channels</li>
                  <li>app_mention</li>
                </ul>
              </li>
              <li>
                <strong>Slash Commands:</strong> Create a slash command (e.g., /myapp)
              </li>
            </ol>
          </section>

          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Install App to Workspace</h2>
            <p className="mb-3">You can install this app to your Slack workspace directly using the button below:</p>
            <div className="my-4">
              <SlackInstallSection initialHasToken={slackStatus.hasToken} />
            </div>
            <p className="mt-3">Or follow these steps manually:</p>
            <ol className="list-decimal list-inside space-y-3">
              <li>Go to "Install App" in the sidebar</li>
              <li>Click "Install to Workspace"</li>
              <li>Authorize the requested permissions</li>
            </ol>
          </section>

          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step 4: Configure Environment Variables</h2>
            <p className="mb-3">Add the following values to your <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">.env.local</code> file:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>SLACK_CLIENT_ID - From Basic Information → App Credentials</li>
              <li>SLACK_CLIENT_SECRET - From Basic Information → App Credentials</li>
              <li>SLACK_SIGNING_SECRET - From Basic Information → App Credentials</li>
              <li>SLACK_BOT_TOKEN - From OAuth & Permissions → Bot User OAuth Token</li>
              <li>SLACK_APP_TOKEN - From Basic Information → App-Level Tokens (create one)</li>
            </ul>
          </section>

          <section className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step 5: Start Development</h2>
            <p>Run the development server:</p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 overflow-x-auto">
              <code>docker-compose up</code>
            </pre>
            <p className="mt-3">Your Slack app setup guide is now running at <a href="http://localhost:3100" className="text-blue-600 dark:text-blue-400 hover:underline">http://localhost:3100</a></p>
          </section>
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Slack App Setup Guide - Built with Next.js</p>
      </footer>
    </div>
  );
}
