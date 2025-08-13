import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Apple,
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  Settings,
  Brain
} from 'lucide-react';
import NutritionOverviewCard from '../components/nutrition/NutritionOverviewCard';
import MacroTrackingChart from '../components/nutrition/MacroTrackingChart';
import FoodLogEntry from '../components/nutrition/FoodLogEntry';
import NutrientBreakdown from '../components/nutrition/NutrientBreakdown';
import MealPlanSuggestions from '../components/nutrition/MealPlanSuggestions';
import NutritionGoals from '../components/nutrition/NutritionGoals';
import HydrationTracker from '../components/nutrition/HydrationTracker';
import NutritionInsights from '../components/nutrition/NutritionInsights';
import MealTimingOptimization from '../components/nutrition/MealTimingOptimization';
import SupplementRecommendations from '../components/nutrition/SupplementRecommendations';
import NutritionMilestones from '../components/nutrition/NutritionMilestones';
import DailyNutritionChart from '../components/nutrition/DailyNutritionChart';
import NutritionReportExport from '../components/nutrition/NutritionReportExport';
import { useNutrition } from '../hooks/useNutrition';

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
    icon: Apple,
    color: 'from-emerald-500 to-teal-600',
    description: 'Nutrition score, trends, and achievements'
  },
  {
    id: 'tracking',
    label: 'Tracking',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    description: 'Food logging and macro analysis'
  },
  {
    id: 'optimization',
    label: 'Optimization',
    icon: Target,
    color: 'from-orange-500 to-red-600',
    description: 'AI recommendations and meal planning'
  }
];

const NutritionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { error, clearError, currentEntry, weeklyTotals } = useNutrition();

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
            {/* Nutrition Score - Main Focus */}
            <NutritionOverviewCard />
            <NutritionGoals />
            {/* Daily Nutrition Trends Chart */}
            <DailyNutritionChart />
            
            <NutrientBreakdown />
            
            
            {/* Export Nutrition Reports */}
            {/* <NutritionReportExport />*/}
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
            {/* Food Log Entry - Primary Tracking Tool */}
            <FoodLogEntry />
            
            {/* Macro Tracking Chart */}
           
            
            {/* Detailed Nutrient Breakdown */}
            
            
            {/* Hydration Tracker - Moved from Optimization */}
            <HydrationTracker />
            {/* Nutrition Goals - Moved from Overview */}
            
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
            {/* AI Nutrition Insights */}
            <NutritionInsights />
            
            {/* Meal Plan Suggestions */}
            <MealPlanSuggestions />
            
            {/* Meal Timing Optimization */}
            <MealTimingOptimization />
            
            {/* Supplement Recommendations */}
            <SupplementRecommendations />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  // Get current nutrition data for the stats cards
  const displayTotals = weeklyTotals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  };

  // Weekly targets (7 days)
  const weeklyTargets = {
    calories: 14000,
    protein: 1050,
    carbs: 1400,
    fats: 490
  };

  // Calculate daily averages for display
  const dailyAverages = {
    calories: Math.round(displayTotals.calories / 7),
    protein: Math.round((displayTotals.protein / 7) * 10) / 10,
    carbs: Math.round((displayTotals.carbs / 7) * 10) / 10,
    fats: Math.round((displayTotals.fats / 7) * 10) / 10
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
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Apple className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Weekly Nutrition Hub</h1>
            <p className="text-gray-300">Track your 7-day nutrition optimization</p>
          </div>
        </div>

        {/* Weekly Nutrition Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {Math.round(displayTotals.calories).toLocaleString()}
            </div>
            <div className="text-gray-300 text-sm">Weekly Calories</div>
            <div className="flex items-center justify-center mt-2">
              <Target className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-blue-400 text-xs">Avg: {dailyAverages.calories}/day</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(displayTotals.protein * 10) / 10}g</div>
            <div className="text-gray-300 text-sm">Weekly Protein</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
              <span className="text-emerald-400 text-xs">Avg: {dailyAverages.protein}g/day</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{Math.round(displayTotals.carbs * 10) / 10}g</div>
            <div className="text-gray-300 text-sm">Weekly Carbs</div>
            <div className="flex items-center justify-center mt-2">
              <Zap className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400 text-xs">Avg: {dailyAverages.carbs}g/day</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{Math.round(displayTotals.fats * 10) / 10}g</div>
            <div className="text-gray-300 text-sm">Weekly Fats</div>
            <div className="flex items-center justify-center mt-2">
              <Target className="w-4 h-4 text-orange-400 mr-1" />
              <span className="text-orange-400 text-xs">Avg: {dailyAverages.fats}g/day</span>
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
                      layoutId="activeNutritionTabIndicator"
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

export default NutritionPage;