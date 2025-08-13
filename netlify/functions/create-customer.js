/**
 * Create or update Stripe customer and sync with Firebase
 * @param {Object} event - Netlify function event
 * @returns {Object} Response with customer data
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
  const { userId, email, name } = body;
  
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'Valid userId is required' };
  }
  
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { valid: false, error: 'Valid email is required' };
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

    const { userId, email, name } = body;

    // Check if user already has a Stripe customer ID in Firebase
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    let customerId = userData?.stripeCustomerId;

    if (customerId) {
      // Verify customer exists in Stripe
      try {
        const customer = await stripe.customers.retrieve(customerId);
        
        // Update customer if needed
        if (customer.email !== email || customer.name !== name) {
          await stripe.customers.update(customerId, {
            email,
            name: name || email.split('@')[0],
          });
        }
      } catch (stripeError) {
        // Customer doesn't exist in Stripe, create new one
        customerId = null;
      }
    }

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email,
        name: name || email.split('@')[0],
        metadata: {
          userId,
        },
      });
      
      customerId = customer.id;
    }

    // Update Firebase with customer ID and subscription info
    await userRef.update({
      stripeCustomerId: customerId,
      email,
      name: name || email.split('@')[0],
      subscription: {
        status: userData?.subscription?.status || 'inactive',
        planId: userData?.subscription?.planId || null,
        currentPeriodEnd: userData?.subscription?.currentPeriodEnd || null,
        cancelAtPeriodEnd: userData?.subscription?.cancelAtPeriodEnd || false,
      },
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    });

    console.log(`Customer created/updated: ${customerId} for user: ${userId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        customerId,
        message: 'Customer created/updated successfully',
      }),
    };

  } catch (error) {
    console.error('Error in create-customer:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      }),
    };
  }
};