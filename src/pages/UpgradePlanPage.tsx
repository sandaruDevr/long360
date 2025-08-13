import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Zap,
  Bot,
  Dna,
  Activity,
  Target,
  Upload,
  Headphones,
  Shield,
  TrendingUp,
  Apple,
  Dumbbell,
  Stethoscope, // Added
  Moon, // Added
  Pill // Added
} from 'lucide-react';
import SubscriptionManager from '../components/SubscriptionManager';

const UpgradePlanPage: React.FC = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Unlock the full potential of LongevAI360 with advanced AI features, unlimited access, and personalized optimization protocols.
        </p>
      </motion.div>

      {/* Subscription Manager Component */}
      <motion.div variants={itemVariants} className="mb-12">
        <SubscriptionManager />
      </motion.div>

      {/* Social Proof */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Join 10,000+ Premium Members</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
                <div className="text-gray-300 text-sm">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">4.9★</div>
                <div className="text-gray-300 text-sm">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-300 text-sm">Medical Partners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300 text-sm">Expert Support</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>No setup fees</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default UpgradePlanPage;
