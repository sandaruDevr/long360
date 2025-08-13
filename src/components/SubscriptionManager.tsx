import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Check, 
  ArrowRight, 
  Loader, 
  AlertCircle,
  CheckCircle,
  Calendar,
  CreditCard,
  Settings,
  X
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

const SubscriptionManager: React.FC = () => {
  const {
    subscriptionStatus,
    loading,
    error,
    hasActiveSubscription,
    isOnTrial,
    isCanceledButActive,
    startSubscription,
    openBillingPortal,
    cancelSubscription,
    changeSubscription,
    getDaysUntilEnd,
    clearError,
    PLANS
  } = useSubscription();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleStartSubscription = async (planType: 'monthly' | 'yearly') => {
    setIsProcessing(true);
    try {
      await startSubscription(planType);
    } catch (err) {
      console.error('Failed to start subscription:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    setIsProcessing(true);
    try {
      await openBillingPortal();
    } catch (err) {
      console.error('Failed to open billing portal:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      await cancelSubscription();
      setShowCancelConfirm(false);
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeSubscription = async (planType: 'monthly' | 'yearly') => {
    setIsProcessing(true);
    try {
      await changeSubscription(planType);
    } catch (err) {
      console.error('Failed to change subscription:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="flex items-center justify-center">
          <Loader className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-white">Loading subscription status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Current Subscription Status */}
      {hasActiveSubscription ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Premium Active</h3>
                <p className="text-gray-300">{subscriptionStatus?.planName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isOnTrial && (
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Trial
                </span>
              )}
              {isCanceledButActive && (
                <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  Canceling
                </span>
              )}
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                {subscriptionStatus?.status}
              </span>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Billing Cycle</span>
              </div>
              <p className="text-gray-300">
                {subscriptionStatus?.currentPeriodEnd && (
                  <>
                    Next billing: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                    {getDaysUntilEnd() && (
                      <span className="text-blue-400 ml-2">
                        ({getDaysUntilEnd()} days)
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-semibold">Status</span>
              </div>
              <p className="text-gray-300">
                {isCanceledButActive 
                  ? 'Active until period end' 
                  : isOnTrial 
                  ? 'Free trial active'
                  : 'Premium subscription active'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleOpenBillingPortal}
              disabled={isProcessing}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              <span>Manage Billing</span>
            </motion.button>

            {!isCanceledButActive && (
              <motion.button
                onClick={() => setShowCancelConfirm(true)}
                className="text-red-400 hover:text-red-300 px-4 py-3 font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Cancel Subscription
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        /* Subscription Plans */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(PLANS).map(([key, plan]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                <p className="text-gray-300">per {plan.interval}</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => handleStartSubscription(key as 'monthly' | 'yearly')}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              >
                {isProcessing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Start {plan.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
                </p>
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Keep Subscription
                  </motion.button>
                  <motion.button
                    onClick={handleCancelSubscription}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {isProcessing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Cancel</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionManager;