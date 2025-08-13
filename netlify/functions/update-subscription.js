/**
 * Update Stripe subscription (upgrade/downgrade)
 * @param {Object} event - Netlify function event
 * @returns {Object} Response with updated subscription
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
  const { userId, newPriceId, action } = body;
  
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'Valid userId is required' };
  }
  
  if (!action || !['upgrade', 'downgrade', 'cancel'].includes(action)) {
    return { valid: false, error: 'Valid action is required (upgrade, downgrade, cancel)' };
  }
  
  if ((action === 'upgrade' || action === 'downgrade') && (!newPriceId || typeof newPriceId !== 'string')) {
    return { valid: false, error: 'Valid newPriceId is required for upgrade/downgrade' };
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

    const { userId, newPriceId, action } = body;

    // Get user data from Firebase
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    if (!userData || !userData.stripeCustomerId || !userData.subscription?.id) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User or subscription not found' }),
      };
    }

    const subscriptionId = userData.subscription.id;
    let updatedSubscription;

    if (action === 'cancel') {
      // Cancel subscription at period end
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      // Get current subscription
      const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      // Update subscription with new price
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: currentSubscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations',
      });
    }

    // Update Firebase with new subscription data
    const subscriptionData = {
      id: updatedSubscription.id,
      status: updatedSubscription.status,
      planId: updatedSubscription.items.data[0]?.price?.id,
      planName: updatedSubscription.items.data[0]?.price?.nickname || 'Premium Plan',
      currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
      trialEnd: updatedSubscription.trial_end ? new Date(updatedSubscription.trial_end * 1000).toISOString() : null,
    };

    await userRef.update({
      subscription: subscriptionData,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    });

    console.log(`Subscription ${action} completed for user: ${userId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        subscription: subscriptionData,
        message: `Subscription ${action} completed successfully`,
      }),
    };

  } catch (error) {
    console.error('Error in update-subscription:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to update subscription',
      }),
    };
  }
};