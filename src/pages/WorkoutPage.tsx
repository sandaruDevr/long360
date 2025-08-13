import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Target,
  Calendar,
  Trophy,
  Dumbbell,
  TrendingUp,
  AlertCircle,
  Zap,
  BarChart3,
  Play,
  Timer
} from 'lucide-react';
import WorkoutPlanner from '../components/workout/WorkoutPlanner';
import WorkoutTracking from '../components/workout/WorkoutTracking';
import { useWorkout } from '../hooks/useWorkout';

type TabType = 'planner' | 'tracking';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'planner',
    label: 'Workout Planner',
    icon: Target,
    color: 'from-orange-500 to-red-600',
    description: 'AI-generated personalized workout plans'
  },
  {
    id: 'tracking',
    label: 'Progress Tracking',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    description: 'Monitor performance and achievements'
  }
];

const WorkoutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('planner');
  const [plannerView, setPlannerView] = useState<PlannerView>('current');
  const { workoutStats, loading, error, clearError } = useWorkout();

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
      case 'planner':
        return (
          <motion.div
            key="planner"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <WorkoutPlanner />
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
          >
            <WorkoutTracking />
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
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Workout Center</h1>
            <p className="text-gray-300">Optimize your fitness and performance</p>
          </div>
        </div>

        {/* Quick Workout Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {loading ? '...' : workoutStats ? `${workoutStats.averageDuration} min` : '0 min'}
            </div>
            <div className="text-gray-300 text-sm">Last Workout</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">Avg duration</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {loading ? '...' : workoutStats ? workoutStats.thisWeekWorkouts : '0'}
            </div>
            <div className="text-gray-300 text-sm">This Week</div>
            <div className="flex items-center justify-center mt-2">
              <Target className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : workoutStats ? `Goal: ${Math.max(5, workoutStats.thisWeekWorkouts + 1)}` : 'Goal: 5'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {loading ? '...' : workoutStats ? `${workoutStats.consistency}%` : '0%'}
            </div>
            <div className="text-gray-300 text-sm">Consistency</div>
            <div className="flex items-center justify-center mt-2">
              <Calendar className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : workoutStats ? `${workoutStats.thisMonthWorkouts} this month` : 'This month'}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {loading ? '...' : workoutStats ? workoutStats.currentStreak : '0'}
            </div>
            <div className="text-gray-300 text-sm">Current Streak</div>
            <div className="flex items-center justify-center mt-2">
              <Zap className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">
                {loading ? '...' : workoutStats ? `Best: ${workoutStats.longestStreak}` : 'days'}
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
                      layoutId="activeWorkoutTabIndicator"
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

export default WorkoutPage;