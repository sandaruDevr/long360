# Stripe Payment Integration Setup Guide

This guide will help you set up the complete Stripe payment integration for your LongevAI360 application.

## Prerequisites

1. **Stripe Account**: Create a Stripe account at [stripe.com](https://stripe.com)
2. **Netlify Account**: Ensure your app is deployed on Netlify
3. **Firebase Project**: Have Firebase Realtime Database configured

## Step 1: Stripe Dashboard Configuration

### 1.1 Create Products and Prices

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Create two products:

**Monthly Premium Plan:**
- Name: "LongevAI360 Premium Monthly"
- Description: "Monthly subscription to LongevAI360 premium features"
- Pricing: $19.99 USD, recurring monthly
- Copy the Price ID (starts with `price_`)

**Yearly Premium Plan:**
- Name: "LongevAI360 Premium Yearly"
- Description: "Yearly subscription to LongevAI360 premium features"
- Pricing: $199.99 USD, recurring yearly
- Copy the Price ID (starts with `price_`)

### 1.2 Configure Webhooks

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-netlify-site.netlify.app/.netlify/functions/stripe-webhook`
4. Select these events:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_`)

### 1.3 Get API Keys

1. Go to [Stripe Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Environment Variables

### 2.1 Netlify Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following variables:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NODE_ENV=production
```

### 2.2 Local Development (.env)

Create a `.env` file in your project root:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_YEARLY_PRICE_ID=price_your_yearly_price_id
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NODE_ENV=development
```

## Step 3: Firebase Database Structure

The integration will create the following structure in your Firebase Realtime Database:

```json
{
  "users": {
    "userId": {
      "stripeCustomerId": "cus_...",
      "email": "user@example.com",
      "name": "User Name",
      "subscription": {
        "id": "sub_...",
        "status": "active",
        "planId": "price_...",
        "planName": "Premium Plan",
        "currentPeriodStart": "2024-01-01T00:00:00.000Z",
        "currentPeriodEnd": "2024-02-01T00:00:00.000Z",
        "cancelAtPeriodEnd": false,
        "trialEnd": null
      }
    }
  },
  "payments": {
    "userId": {
      "paymentId": {
        "paymentIntentId": "pi_...",
        "amount": 1999,
        "currency": "usd",
        "status": "succeeded",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  },
  "invoices": {
    "userId": {
      "invoiceId": {
        "invoiceId": "in_...",
        "subscriptionId": "sub_...",
        "amount": 1999,
        "currency": "usd",
        "status": "paid",
        "paidAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
}
```

## Step 4: Frontend Integration

### 4.1 Update Price IDs

In `src/services/stripeService.ts`, update the `PRICE_IDS` constant:

```typescript
export const PRICE_IDS = {
  MONTHLY: 'price_your_actual_monthly_price_id',
  YEARLY: 'price_your_actual_yearly_price_id',
};
```

### 4.2 Add Subscription Manager to Pages

The `SubscriptionManager` component is already integrated into the `UpgradePlanPage`. You can also add it to other pages:

```typescript
import SubscriptionManager from '../components/SubscriptionManager';

// In your component JSX:
<SubscriptionManager />
```

## Step 5: Testing

### 5.1 Test Mode

1. Use Stripe test mode initially
2. Use test card numbers from [Stripe Testing](https://stripe.com/docs/testing)
3. Test successful payment: `4242424242424242`
4. Test declined payment: `4000000000000002`

### 5.2 Webhook Testing

1. Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for local testing:
```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

2. Test webhook events:
```bash
stripe trigger payment_intent.succeeded
stripe trigger customer.subscription.created
```

## Step 6: Production Deployment

### 6.1 Switch to Live Mode

1. In Stripe Dashboard, toggle to "Live mode"
2. Update environment variables with live keys
3. Update webhook endpoint to production URL
4. Test with real payment methods

### 6.2 Security Checklist

- ✅ Webhook signatures are verified
- ✅ API keys are stored securely in environment variables
- ✅ CORS headers are properly configured
- ✅ Input validation is implemented
- ✅ Error handling is comprehensive
- ✅ Sensitive data is not logged

## Step 7: Monitoring

### 7.1 Stripe Dashboard

Monitor payments, subscriptions, and webhooks in the Stripe Dashboard.

### 7.2 Netlify Functions Logs

Check Netlify function logs for any errors or issues.

### 7.3 Firebase Database

Monitor the database for proper data synchronization.

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Ensure webhook secret is correct
   - Check that the endpoint URL is accessible

2. **Customer creation fails**
   - Verify Firebase credentials
   - Check user data exists in Firebase

3. **Payment link creation fails**
   - Verify price IDs are correct
   - Ensure customer exists in Stripe

4. **Subscription status not updating**
   - Check webhook delivery in Stripe Dashboard
   - Verify Firebase write permissions

### Support

For additional support:
1. Check Stripe documentation: [stripe.com/docs](https://stripe.com/docs)
2. Review Netlify Functions docs: [docs.netlify.com/functions](https://docs.netlify.com/functions)
3. Firebase documentation: [firebase.google.com/docs](https://firebase.google.com/docs)

## Security Notes

- Never expose secret keys in frontend code
- Always validate webhook signatures
- Implement proper error handling
- Use HTTPS in production
- Regularly rotate API keys
- Monitor for suspicious activity