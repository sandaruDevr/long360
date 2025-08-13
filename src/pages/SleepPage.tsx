import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  Moon,
  Brain,
  Zap,
  BarChart3,
  Target,
  Settings
} from 'lucide-react';
import SleepOverviewCard from '../components/sleep/SleepOverviewCard';
import SleepTrackingChart from '../components/sleep/SleepTrackingChart';
import SleepStageBreakdown from '../components/sleep/SleepStageBreakdown';
import SleepOptimization from '../components/sleep/SleepOptimization';
import SleepEnvironmentChecklist from '../components/sleep/SleepEnvironmentChecklist';
import SleepGoals from '../components/sleep/SleepGoals';
import DailySleepQualityChart from '../components/sleep/DailySleepQualityChart';
import SleepMilestones from '../components/sleep/SleepMilestones';
import SleepQuickTips from '../components/sleep/SleepQuickTips';
import SleepReportExport from '../components/sleep/SleepReportExport';
import SleepEntryForm from '../components/sleep/SleepEntryForm';
import { useSleep } from '../hooks/useSleep';

type TabType = 'overview' | 'tracking' | 'optimization';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Moon,
    color: 'from-indigo-500 to-purple-600',
    description: 'Sleep quality, trends, and achievements'
  },
  {
    id: 'tracking',
    label: 'Tracking',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    description: 'Detailed analysis and goal management'
  },
  {
    id: 'optimization',
    label: 'Optimization',
    icon: Target,
    color: 'from-emerald-500 to-teal-600',
    description: 'AI recommendations and environment setup'
  }
];

const SleepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { 
    sleepEntries, 
    sleepGoals, 
    sleepAchievements, 
    sleepStats, 
    loading, 
    error, 
    addSleepEntry,
    updateSleepEntry,
    addSleepGoal,
    updateSleepGoalItem,
    removeSleepGoal,
    getTodayEntry,
    getLatestEntry,
    clearError
  } = useSleep();

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
      case 'overview':
        return (
          <motion.div
            key="overview"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Sleep Quality Score - Last Night Focus */}
            <SleepOverviewCard 
              sleepStats={sleepStats}
              latestEntry={getLatestEntry()}
             sleepEntries={sleepEntries}
              loading={loading}
            />
            
            {/* Sleep Entry Form - Enhanced Manual Entry */}
            <SleepEntryForm
              addSleepEntry={addSleepEntry}
              loading={loading}
              latestEntry={getLatestEntry()}
            />
            
            {/* Daily Sleep Quality Trends Chart */}
            <DailySleepQualityChart 
              sleepEntries={sleepEntries}
              loading={loading}
            />
            
            {/* Sleep Stage Breakdown - Moved from Tracking */}
            <SleepStageBreakdown 
              latestEntry={getLatestEntry()}
              loading={loading}
            />
            
            {/* Sleep Achievements & Milestones */}
            <SleepMilestones 
              achievements={sleepAchievements}
             sleepEntries={sleepEntries}
              loading={loading}
            />
            
            {/* Quick Sleep Tips */}
            <SleepQuickTips 
              sleepStats={sleepStats}
            />
            
            {/* Export Sleep Reports */}
           
          </motion.div>
        );
      
      case 'tracking':
        return (
          <motion.div
            key="tracking"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Detailed Sleep Tracking Chart */}
            <SleepTrackingChart 
              sleepEntries={sleepEntries}
              addSleepEntry={addSleepEntry}
              updateSleepEntry={updateSleepEntry}
              loading={loading}
            />
            
            {/* Sleep Goals */}
            <SleepGoals 
              sleepGoals={sleepGoals}
              sleepEntries={sleepEntries}
              addSleepGoal={addSleepGoal}
              updateSleepGoal={updateSleepGoalItem}
              removeSleepGoal={removeSleepGoal}
              loading={loading}
            />
          </motion.div>
        );
      
      case 'optimization':
        return (
          <motion.div
            key="optimization"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Sleep Optimization Recommendations */}
            <SleepOptimization 
              sleepStats={sleepStats}
              latestEntry={getLatestEntry()}
            />
            
            {/* Sleep Environment Checklist */}
            <SleepEnvironmentChecklist 
              sleepStats={sleepStats}
              latestEntry={getLatestEntry()}
            />
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
          <p className="text-red-300">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-300 transition-colors">×</button>
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Moon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Sleep Center</h1>
            <p className="text-gray-300">Optimize your rest and recovery</p>
          </div>
        </div>

        {/* Quick Sleep Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-2">
              {loading ? '...' : sleepStats ? `${sleepStats.averageSleepDuration}h` : '0h'}
            </div>
            <div className="text-gray-300 text-sm">Last Night</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : sleepStats ? `${sleepStats.currentStreak} day streak` : 'No data'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {loading ? '...' : sleepStats ? sleepStats.averageSleepScore : '0'}
            </div>
            <div className="text-gray-300 text-sm">Sleep Score</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : sleepStats ? `${sleepStats.thisWeekEntries} this week` : 'No data'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {loading ? '...' : sleepStats ? `${sleepStats.averageEfficiency}%` : '0%'}
            </div>
            <div className="text-gray-300 text-sm">Efficiency</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : sleepStats ? 
                  sleepStats.averageEfficiency >= 90 ? 'Excellent' :
                  sleepStats.averageEfficiency >= 80 ? 'Good' : 'Needs improvement'
                  : 'No data'}
              </span>
            </div>
          </div>
        </div>
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
                      layoutId="activeTabIndicator"
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

export default SleepPage;