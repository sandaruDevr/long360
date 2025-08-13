/**
 * Create Stripe customer billing portal session
 * @param {Object} event - Netlify function event
 * @returns {Object} Response with billing portal URL
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.database();

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

/**
 * Validate request body
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
function validateRequest(body) {
  const { userId, returnUrl } = body;
  
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'Valid userId is required' };
  }
  
  if (!returnUrl || typeof returnUrl !== 'string') {
    return { valid: false, error: 'Valid returnUrl is required' };
  }
  
  return { valid: true };
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    
    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: validation.error }),
      };
    }

    const { userId, returnUrl } = body;

    // Get user data from Firebase
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    if (!userData || !userData.stripeCustomerId) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Customer not found' }),
      };
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: returnUrl,
    });

    console.log(`Billing portal session created for user: ${userId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url: session.url,
      }),
    };

  } catch (error) {
    console.error('Error in create-billing-portal:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to create billing portal session',
      }),
    };
  }
};