/**
 * Get user subscription status from Firebase and Stripe
 * @param {Object} event - Netlify function event
 * @returns {Object} Response with subscription status
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
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userId } = event.queryStringParameters || {};

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

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

    let subscriptionStatus = {
      hasActiveSubscription: false,
      status: 'inactive',
      planId: null,
      planName: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEnd: null,
    };

    // If user has subscription data, verify with Stripe
    if (userData.subscription?.id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(userData.subscription.id);
        
        subscriptionStatus = {
          hasActiveSubscription: ['active', 'trialing'].includes(subscription.status),
          status: subscription.status,
          planId: subscription.items.data[0]?.price?.id,
          planName: subscription.items.data[0]?.price?.nickname || 'Premium Plan',
          currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        };

        // Update Firebase if data differs
        if (userData.subscription.status !== subscription.status) {
          await userRef.update({
            'subscription/status': subscription.status,
            updatedAt: admin.database.ServerValue.TIMESTAMP,
          });
        }
      } catch (stripeError) {
        console.error('Error retrieving subscription from Stripe:', stripeError);
        // Use Firebase data as fallback
        subscriptionStatus = {
          hasActiveSubscription: ['active', 'trialing'].includes(userData.subscription.status),
          status: userData.subscription.status,
          planId: userData.subscription.planId,
          planName: userData.subscription.planName,
          currentPeriodEnd: userData.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: userData.subscription.cancelAtPeriodEnd,
          trialEnd: userData.subscription.trialEnd,
        };
      }
    }

    console.log(`Subscription status retrieved for user: ${userId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        subscription: subscriptionStatus,
        customerId: userData.stripeCustomerId,
      }),
    };

  } catch (error) {
    console.error('Error in get-subscription-status:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to get subscription status',
      }),
    };
  }
};