/**
 * Create Stripe payment link for subscription
 * @param {Object} event - Netlify function event
 * @returns {Object} Response with payment link
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

// Predefined price IDs (set these in your Stripe dashboard)
const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_default',
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_default',
};

/**
 * Validate request body
 * @param {Object} body - Request body
 * @returns {Object} Validation result
 */
function validateRequest(body) {
  const { userId, priceId, successUrl, cancelUrl } = body;
  
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'Valid userId is required' };
  }
  
  if (!priceId || typeof priceId !== 'string') {
    return { valid: false, error: 'Valid priceId is required' };
  }
  
  if (!successUrl || typeof successUrl !== 'string') {
    return { valid: false, error: 'Valid successUrl is required' };
  }
  
  if (!cancelUrl || typeof cancelUrl !== 'string') {
    return { valid: false, error: 'Valid cancelUrl is required' };
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

    const { userId, priceId, successUrl, cancelUrl } = body;

    // Get user data from Firebase
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    let customerId = userData.stripeCustomerId;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.name || userData.displayName,
        metadata: {
          userId,
        },
      });
      
      customerId = customer.id;
      
      // Update Firebase with customer ID
      await userRef.update({
        stripeCustomerId: customerId,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
      });
    }

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      after_completion: {
        type: 'redirect',
        redirect: {
          url: successUrl,
        },
      },
      metadata: {
        userId,
        priceId,
      },
    });

    console.log(`Payment link created: ${paymentLink.id} for user: ${userId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentLink: paymentLink.url,
        paymentLinkId: paymentLink.id,
      }),
    };

  } catch (error) {
    console.error('Error in create-payment-link:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to create payment link',
      }),
    };
  }
};