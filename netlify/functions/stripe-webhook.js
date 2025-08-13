/**
 * Handle Stripe webhooks and sync with Firebase
 * @param {Object} event - Netlify function event
 * @returns {Object} Response confirming webhook processing
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
  'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

/**
 * Get user ID from Stripe customer
 * @param {string} customerId - Stripe customer ID
 * @returns {string|null} Firebase user ID
 */
async function getUserIdFromCustomer(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.metadata?.userId || null;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return null;
  }
}

/**
 * Update user subscription in Firebase
 * @param {string} userId - Firebase user ID
 * @param {Object} subscriptionData - Subscription data
 */
async function updateUserSubscription(userId, subscriptionData) {
  const userRef = db.ref(`users/${userId}`);
  
  await userRef.update({
    subscription: subscriptionData,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });
  
  console.log(`Updated subscription for user: ${userId}`, subscriptionData);
}

/**
 * Handle subscription created event
 * @param {Object} subscription - Stripe subscription object
 */
async function handleSubscriptionCreated(subscription) {
  const userId = await getUserIdFromCustomer(subscription.customer);
  
  if (!userId) {
    console.error('No userId found for customer:', subscription.customer);
    return;
  }

  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    planId: subscription.items.data[0]?.price?.id,
    planName: subscription.items.data[0]?.price?.nickname || 'Premium Plan',
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  };

  await updateUserSubscription(userId, subscriptionData);
}

/**
 * Handle subscription updated event
 * @param {Object} subscription - Stripe subscription object
 */
async function handleSubscriptionUpdated(subscription) {
  const userId = await getUserIdFromCustomer(subscription.customer);
  
  if (!userId) {
    console.error('No userId found for customer:', subscription.customer);
    return;
  }

  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    planId: subscription.items.data[0]?.price?.id,
    planName: subscription.items.data[0]?.price?.nickname || 'Premium Plan',
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  };

  await updateUserSubscription(userId, subscriptionData);
}

/**
 * Handle subscription deleted event
 * @param {Object} subscription - Stripe subscription object
 */
async function handleSubscriptionDeleted(subscription) {
  const userId = await getUserIdFromCustomer(subscription.customer);
  
  if (!userId) {
    console.error('No userId found for customer:', subscription.customer);
    return;
  }

  const subscriptionData = {
    id: null,
    status: 'canceled',
    planId: null,
    planName: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    trialEnd: null,
    canceledAt: new Date().toISOString(),
  };

  await updateUserSubscription(userId, subscriptionData);
}

/**
 * Handle payment succeeded event
 * @param {Object} paymentIntent - Stripe payment intent object
 */
async function handlePaymentSucceeded(paymentIntent) {
  const userId = await getUserIdFromCustomer(paymentIntent.customer);
  
  if (!userId) {
    console.error('No userId found for customer:', paymentIntent.customer);
    return;
  }

  // Log payment in Firebase
  const paymentRef = db.ref(`payments/${userId}`).push();
  await paymentRef.set({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    metadata: paymentIntent.metadata,
  });

  console.log(`Payment recorded for user: ${userId}, amount: ${paymentIntent.amount}`);
}

/**
 * Handle invoice payment succeeded event
 * @param {Object} invoice - Stripe invoice object
 */
async function handleInvoicePaymentSucceeded(invoice) {
  const userId = await getUserIdFromCustomer(invoice.customer);
  
  if (!userId) {
    console.error('No userId found for customer:', invoice.customer);
    return;
  }

  // Log invoice payment in Firebase
  const invoiceRef = db.ref(`invoices/${userId}`).push();
  await invoiceRef.set({
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status,
    paidAt: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
    periodStart: new Date(invoice.period_start * 1000).toISOString(),
    periodEnd: new Date(invoice.period_end * 1000).toISOString(),
  });

  console.log(`Invoice payment recorded for user: ${userId}, amount: ${invoice.amount_paid}`);
}

/**
 * Handle invoice payment failed event
 * @param {Object} invoice - Stripe invoice object
 */
async function handleInvoicePaymentFailed(invoice) {
  const userId = await getUserIdFromCustomer(invoice.customer);
  
  if (!userId) {
    console.error('No userId found for customer:', invoice.customer);
    return;
  }

  // Update user with payment failure info
  const userRef = db.ref(`users/${userId}`);
  await userRef.update({
    'subscription/paymentFailed': true,
    'subscription/lastPaymentFailure': new Date().toISOString(),
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });

  console.log(`Payment failed recorded for user: ${userId}`);
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
    const sig = event.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('Stripe webhook secret not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Webhook secret not configured' }),
      };
    }

    // Verify webhook signature
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    console.log(`Received webhook: ${stripeEvent.type}`);

    // Handle different event types
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(stripeEvent.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };

  } catch (error) {
    console.error('Error in stripe-webhook:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Webhook processing failed',
      }),
    };
  }
};