'use server'

import { clearToken, getToken, hasToken, testToken } from "@/lib/token-store";
import { requireApproval, getSlackContactChannel } from "@/lib/humanlayer";

export async function getSlackStatus() {
  const hasStoredToken = await hasToken();
  const token = hasStoredToken ? await getToken() : null;

  console.log('getSlackStatus called, token status:', {
    hasToken: hasStoredToken,
    teamName: token?.teamName || null,
    teamId: token?.teamId || null
  });

  return {
    hasToken: hasStoredToken,
    teamName: token?.teamName || null,
    teamId: token?.teamId || null,
  };
}

export async function clearSlackToken() {
  console.log('clearSlackToken called');
  const success = await clearToken();
  return { success };
}

export async function testSlackToken() {
  console.log('testSlackToken called');
  const result = await testToken();
  console.log('testSlackToken result:', result);
  return result;
}

// Define the actual pizza ordering function that will be wrapped with approval
async function processPizzaOrder(orderData: Record<string, any>) {
  console.log('Processing pizza order:', orderData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock response
  return {
    success: true,
    orderId: Math.floor(Math.random() * 1000000),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    message: "Your pizza order has been placed successfully!"
  };
}

// Wrap the pizza order function with HumanLayer approval
const approvedPizzaOrder = requireApproval(processPizzaOrder);

export async function orderPizza(formData: FormData) {
  // Convert FormData to a regular object
  const orderData: Record<string, any> = {};
  formData.forEach((value, key) => {
    // Handle multiple values for the same key (like checkboxes)
    if (key === 'toppings') {
      if (!orderData[key]) {
        orderData[key] = [];
      }
      orderData[key].push(value);
    } else {
      orderData[key] = value;
    }
  });
  
  try {
    // Get the token from the database
    const token = await getToken();
    
    // Use the token and channel ID if available
    const contactChannel = token?.botToken && token?.channelId
      ? getSlackContactChannel(token.channelId, token.botToken)
      : undefined;
    
    // Call the approved function with the order data
    // If contactChannel is undefined, it will fall back to CLI approval
    const result = await approvedPizzaOrder(orderData);
    return result;
  } catch (error) {
    console.error('Error ordering pizza:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
