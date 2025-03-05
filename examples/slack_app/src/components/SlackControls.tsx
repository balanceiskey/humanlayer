'use client';

import { useState, useEffect } from 'react';
import { orderPizza } from '@/app/actions';

interface TestResult {
  valid: boolean;
  error?: string;
  messageSent?: boolean;
  channelName?: string;
  channelId?: string;
}

interface PizzaOrderResult {
  success: boolean;
  orderId?: number;
  estimatedDelivery?: string;
  message?: string;
  error?: string;
}

interface SlackStatus {
  hasToken: boolean;
  teamName: string | null;
  teamId: string | null;
  channelId?: string | null;
}

export default function SlackControls() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPizzaForm, setShowPizzaForm] = useState(false);
  const [orderingPizza, setOrderingPizza] = useState(false);
  const [pizzaResult, setPizzaResult] = useState<PizzaOrderResult | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [slackStatus, setSlackStatus] = useState<SlackStatus>({
    hasToken: false,
    teamName: null,
    teamId: null
  });

  useEffect(() => {
    setMounted(true);
    
    // Fetch token status from the server
    const fetchTokenStatus = async () => {
      try {
        const response = await fetch('/api/auth/slack/status');
        const data = await response.json();
        setSlackStatus(data);
      } catch (error) {
        console.error('Error fetching token status:', error);
      }
    };
    
    fetchTokenStatus();
  }, []);

  const handleTestToken = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/auth/slack/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      setTestResult(result);
      
      // Refresh token status after testing
      const statusResponse = await fetch('/api/auth/slack/status');
      const statusData = await statusResponse.json();
      setSlackStatus(statusData);
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
        
        // Refresh token status after clearing
        const response = await fetch('/api/auth/slack/status');
        const data = await response.json();
        setSlackStatus(data);
        
        setTestResult(null);
      } catch (error) {
        alert('Failed to clear token');
      } finally {
        setClearing(false);
      }
    }
  };

  const handleOrderPizza = async (formData: FormData) => {
    setOrderingPizza(true);
    setPizzaResult(null);
    setApprovalStatus("Waiting for human approval...");
    
    try {
      const result = await orderPizza(formData);
      setPizzaResult(result);
      setApprovalStatus(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Check if this is a denial message from HumanLayer
      if (typeof errorMessage === 'string' && errorMessage.includes('denied')) {
        setApprovalStatus("Order was denied by a human reviewer");
        setPizzaResult({ 
          success: false, 
          error: errorMessage
        });
      } else {
        setApprovalStatus(null);
        setPizzaResult({ 
          success: false, 
          error: errorMessage
        });
      }
    } finally {
      setOrderingPizza(false);
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
          disabled={testing || !slackStatus.hasToken}
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
          onClick={() => setShowPizzaForm(!showPizzaForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Order Pizza
        </button>
        <button
          onClick={handleClearToken}
          disabled={clearing || !slackStatus.hasToken}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {clearing ? 'Disconnecting...' : 'Disconnect from Slack'}
        </button>
      </div>

      {slackStatus.hasToken && (
        <div className="p-3 rounded bg-blue-100 text-blue-800">
          <p>✓ Connected to Slack workspace: <strong>{slackStatus.teamName}</strong></p>
          {slackStatus.channelId && (
            <p className="mt-1">Channel ID: {slackStatus.channelId}</p>
          )}
        </div>
      )}

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

      {showPizzaForm && (
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Order Pizza via HumanLayer</h3>
          {approvalStatus && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
              <p>{approvalStatus}</p>
              <p className="text-sm mt-1">Check your Slack channel or CLI for approval requests</p>
            </div>
          )}
          <form action={handleOrderPizza} className="space-y-3">
            <div>
              <label htmlFor="size" className="block text-sm font-medium mb-1">Size</label>
              <select 
                id="size" 
                name="size" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                required
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="toppings" className="block text-sm font-medium mb-1">Toppings</label>
              <div className="grid grid-cols-2 gap-2">
                {['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Extra cheese', 'Peppers', 'Olives'].map(topping => (
                  <div key={topping} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`topping-${topping.toLowerCase().replace(' ', '-')}`}
                      name="toppings" 
                      value={topping.toLowerCase()}
                      className="mr-2"
                    />
                    <label htmlFor={`topping-${topping.toLowerCase().replace(' ', '-')}`}>{topping}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Delivery Address</label>
              <textarea 
                id="address" 
                name="address" 
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">Special Instructions</label>
              <input 
                type="text" 
                id="notes" 
                name="notes"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
              />
            </div>
            
            <button 
              type="submit"
              disabled={orderingPizza}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {orderingPizza ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
          
          {pizzaResult && (
            <div className={`mt-4 p-3 rounded ${pizzaResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {pizzaResult.success ? (
                <div>
                  <p className="font-medium">{pizzaResult.message}</p>
                  <p className="mt-1">Order ID: {pizzaResult.orderId}</p>
                  <p className="mt-1">Estimated Delivery: {new Date(pizzaResult.estimatedDelivery!).toLocaleTimeString()}</p>
                </div>
              ) : (
                <p>Failed to place order: {pizzaResult.error}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
