import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createCustomer,
  createPaymentLink,
  getSubscriptionStatus,
  createBillingPortal,
  updateSubscription,
  SubscriptionStatus,
  PLANS
} from '../services/stripeService';

export const useSubscription = () => {
  const { currentUser } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load subscription status
  const loadSubscriptionStatus = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getSubscriptionStatus(currentUser.uid);
      setSubscriptionStatus(response.subscription);
      setError(null);
    } catch (err) {
      console.error('Error loading subscription status:', err);
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Initialize subscription status on mount
  useEffect(() => {
    loadSubscriptionStatus();
  }, [loadSubscriptionStatus]);

  // Create customer
  const initializeCustomer = useCallback(async () => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      await createCustomer(
        currentUser.uid,
        currentUser.email || '',
        currentUser.displayName || undefined
      );
      await loadSubscriptionStatus(); // Refresh status
    } catch (err) {
      console.error('Error initializing customer:', err);
      throw err;
    }
  }, [currentUser, loadSubscriptionStatus]);

  // Start subscription process
  const startSubscription = useCallback(async (
    planType: 'monthly' | 'yearly',
    successUrl?: string,
    cancelUrl?: string
  ) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const plan = PLANS[planType];
      const defaultSuccessUrl = `${window.location.origin}/dashboard?subscription=success`;
      const defaultCancelUrl = `${window.location.origin}/upgrade?subscription=canceled`;

      // Ensure customer exists
      await initializeCustomer();

      // Create payment link
      const response = await createPaymentLink(
        currentUser.uid,
        plan.priceId,
        successUrl || defaultSuccessUrl,
        cancelUrl || defaultCancelUrl
      );

      // Redirect to payment link
      window.location.href = response.paymentLink;
    } catch (err) {
      console.error('Error starting subscription:', err);
      throw err;
    }
  }, [currentUser, initializeCustomer]);

  // Open billing portal
  const openBillingPortal = useCallback(async (returnUrl?: string) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const defaultReturnUrl = `${window.location.origin}/settings`;
      
      const response = await createBillingPortal(
        currentUser.uid,
        returnUrl || defaultReturnUrl
      );

      // Redirect to billing portal
      window.location.href = response.url;
    } catch (err) {
      console.error('Error opening billing portal:', err);
      throw err;
    }
  }, [currentUser]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      await updateSubscription(currentUser.uid, 'cancel');
      await loadSubscriptionStatus(); // Refresh status
    } catch (err) {
      console.error('Error canceling subscription:', err);
      throw err;
    }
  }, [currentUser, loadSubscriptionStatus]);

  // Upgrade/downgrade subscription
  const changeSubscription = useCallback(async (
    newPlanType: 'monthly' | 'yearly'
  ) => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const newPlan = PLANS[newPlanType];
      const action = 'upgrade'; // Simplified - in production, determine based on price comparison
      
      await updateSubscription(currentUser.uid, action, newPlan.priceId);
      await loadSubscriptionStatus(); // Refresh status
    } catch (err) {
      console.error('Error changing subscription:', err);
      throw err;
    }
  }, [currentUser, loadSubscriptionStatus]);

  // Check if user has active subscription
  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription || false;
  
  // Check if user is on trial
  const isOnTrial = subscriptionStatus?.status === 'trialing';
  
  // Check if subscription is canceled but still active
  const isCanceledButActive = subscriptionStatus?.cancelAtPeriodEnd && 
    subscriptionStatus?.status === 'active';

  // Get days until subscription ends
  const getDaysUntilEnd = useCallback(() => {
    if (!subscriptionStatus?.currentPeriodEnd) return null;
    
    const endDate = new Date(subscriptionStatus.currentPeriodEnd);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }, [subscriptionStatus]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // Data
    subscriptionStatus,
    loading,
    error,
    
    // Computed values
    hasActiveSubscription,
    isOnTrial,
    isCanceledButActive,
    
    // Actions
    initializeCustomer,
    startSubscription,
    openBillingPortal,
    cancelSubscription,
    changeSubscription,
    loadSubscriptionStatus,
    getDaysUntilEnd,
    clearError,
    
    // Constants
    PLANS,
  };
};