export default function AuthSuccess() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-md mx-auto text-center mt-16">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">Success!</h1>
          <p>Your Slack app has been successfully installed.</p>
        </div>
        
        <div className="mt-6 text-left p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">What happened?</h2>
          <p className="mb-4">
            The OAuth flow has completed successfully. In a production application, 
            the access tokens would be stored securely in a database and used to 
            interact with the Slack API on behalf of your workspace.
          </p>
          <p>
            For this demo, we've simply logged the successful authentication but 
            haven't stored the tokens permanently.
          </p>
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
