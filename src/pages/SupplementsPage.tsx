import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill,
  TrendingUp,
  Target,
  AlertCircle,
  Brain,
  Plus,
  Calendar
} from 'lucide-react';
import AddSupplementForm from '../components/supplements/AddSupplementForm';
import SupplementList from '../components/supplements/SupplementList';
import SupplementOverview from '../components/supplements/SupplementOverview';
import SupplementInsights from '../components/supplements/SupplementInsights';
import SupplementGoals from '../components/supplements/SupplementGoals';
import { useSupplement } from '../hooks/useSupplement';

type TabType = 'supplements' | 'goals' | 'insights';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'supplements',
    label: 'Supplements',
    icon: Plus,
    color: 'from-purple-500 to-pink-600',
    description: 'Add and manage your supplements'
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    color: 'from-blue-500 to-cyan-600',
    description: 'Track your supplement objectives'
  },
  {
    id: 'insights',
    label: 'AI Insights',
    icon: Brain,
    color: 'from-emerald-500 to-teal-600',
    description: 'AI-powered optimization tips'
  }
];

const SupplementsPage: React.FC = () => {
  const { supplementStats, loading, error, clearError } = useSupplement();
  const [activeTab, setActiveTab] = useState<TabType>('supplements');

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

  const tabContentVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'supplements':
        return (
          <motion.div
            key="supplements"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <AddSupplementForm />
            <SupplementList />
          </motion.div>
        );
      
      case 'goals':
        return (
          <motion.div
            key="goals"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SupplementGoals />
          </motion.div>
        );
      
      case 'insights':
        return (
          <motion.div
            key="insights"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SupplementInsights />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Supplement Tracker</h1>
            <p className="text-gray-300">Optimize your supplementation protocol</p>
          </div>
        </div>

        {/* Quick Supplement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {loading ? '...' : supplementStats?.activeSupplements || 0}
            </div>
            <div className="text-gray-300 text-sm">Active Supplements</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : `${supplementStats?.totalSupplements || 0} total`}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {loading ? '...' : `${supplementStats?.adherenceRate || 0}%`}
            </div>
            <div className="text-gray-300 text-sm">Adherence Rate</div>
            <div className="flex items-center justify-center mt-2">
              <Target className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : 
                 (supplementStats?.adherenceRate || 0) >= 90 ? 'Excellent' :
                 (supplementStats?.adherenceRate || 0) >= 75 ? 'Good' : 'Needs improvement'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {loading ? '...' : `$${supplementStats?.totalCost || 0}`}
            </div>
            <div className="text-gray-300 text-sm">Monthly Cost</div>
            <div className="flex items-center justify-center mt-2">
              <Calendar className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-blue-400 text-xs">Budget tracking</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {loading ? '...' : supplementStats?.supplementScore || 0}
            </div>
            <div className="text-gray-300 text-sm">Optimization Score</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : 
                 (supplementStats?.supplementScore || 0) >= 80 ? 'Optimized' :
                 (supplementStats?.supplementScore || 0) >= 60 ? 'Good' : 'Needs work'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Supplement Overview Hero - Full Width */}
      <motion.div variants={itemVariants} className="mb-8">
        <SupplementOverview />
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-white/15 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active Tab Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSupplementTabIndicator"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl opacity-20`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Tab Content */}
                  <div className="relative z-10 flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.color}` 
                        : 'bg-white/10'
                    }`}>
                      <tab.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                    <div className="text-left sm:hidden">
                      <div className="font-semibold">{tab.label}</div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default SupplementsPage;