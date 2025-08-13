/**
 * Retrieve Stripe payment link details
 * @param {Object} event - Netlify function event
 * @returns {Object} Response with payment link details
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    const { paymentLinkId } = event.queryStringParameters || {};

    if (!paymentLinkId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'paymentLinkId is required' }),
      };
    }

    // Retrieve payment link from Stripe
    const paymentLink = await stripe.paymentLinks.retrieve(paymentLinkId);

    console.log(`Payment link retrieved: ${paymentLinkId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentLink: {
          id: paymentLink.id,
          url: paymentLink.url,
          active: paymentLink.active,
          metadata: paymentLink.metadata,
          line_items: paymentLink.line_items,
        },
      }),
    };

  } catch (error) {
    console.error('Error in retrieve-payment-link:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Payment link not found' }),
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to retrieve payment link',
      }),
    };
  }
};