import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Apple, TrendingUp, Target, Zap, Heart, Shield, X, CheckCircle, Clock, Brain } from 'lucide-react';
import { useNutrition } from '../../hooks/useNutrition';

const NutritionOverviewCard: React.FC = () => {
  const { currentEntry, weeklyNutritionScore, weeklyTotals, getWeeklyAverage, getNutritionTrend, loading } = useNutrition();
  const [showOptimizePopup, setShowOptimizePopup] = useState(false);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/20 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-48 h-48 bg-white/10 rounded-full mx-auto"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nutritionScore = weeklyNutritionScore || 0;
  const maxScore = 100;
  const percentage = (nutritionScore / maxScore) * 100;
  const caloriesTrend = getNutritionTrend('calories');
  const proteinTrend = getNutritionTrend('protein');
  const fiberTrend = getNutritionTrend('fiber');
  
  // Calculate overall trend with proper handling of zero values
  const validTrends = [caloriesTrend, proteinTrend, fiberTrend].filter(trend => 
    trend !== null && trend !== undefined && !isNaN(trend) && isFinite(trend)
  );
  const overallTrend = validTrends.length > 0 
    ? Math.round(validTrends.reduce((sum, trend) => sum + trend, 0) / validTrends.length)
    : 0;
  
  const trendPeriod = 'this week';

  // Use weekly totals for display
  const displayTotals = weeklyTotals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  // Calculate daily averages from weekly totals for display
  const daysWithData = Math.max(1, 7); // Assume 7 days for now
  const dailyAverages = {
    calories: Math.round(displayTotals.calories / daysWithData),
    protein: Math.round((displayTotals.protein / daysWithData) * 10) / 10,
    fiber: Math.round((displayTotals.fiber / daysWithData) * 10) / 10
  };

  const weeklyTargets = {
    calories: 2000 * daysWithData,
    protein: 150 * daysWithData,
    fiber: 30 * daysWithData
  };

  const weeklyAverages = {
    calories: getWeeklyAverage('calories'),
    protein: getWeeklyAverage('protein'),
    fiber: getWeeklyAverage('fiber')
  };

  return (
    <div className="relative overflow-hidden">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Weekly Nutrition Score</h2>
              <p className="text-gray-300">Your 7-day nutrition optimization rating</p>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">
                {overallTrend >= 0 ? '+' : ''}{overallTrend}% {trendPeriod}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Score Display */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                {/* Animated Ring */}
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress Ring */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="url(#nutritionScoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - percentage / 100) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="nutritionScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#0D9488" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div 
                      className="text-6xl font-black text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    >
                      {nutritionScore}
                    </motion.div>
                    <div className="text-xl text-gray-300 font-semibold">/ {maxScore}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Nutrition Metrics */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Weekly Calories</p>
                      <p className="text-gray-400 text-sm">7-day total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{Math.round(displayTotals.calories).toLocaleString()}</p>
                    <p className="text-emerald-400 text-sm">/ {weeklyTargets.calories.toLocaleString()} kcal</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Protein</p>
                      <p className="text-gray-400 text-sm">weekly total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{Math.round(displayTotals.protein * 10) / 10}g</p>
                    <p className="text-emerald-400 text-sm">/ {weeklyTargets.protein}g</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Fiber</p>
                    <p className="text-gray-400 text-sm">weekly total</p>
                  </div>
                </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{Math.round(displayTotals.fiber * 10) / 10}g</p>
                    <p className="text-emerald-400 text-sm">/ {weeklyTargets.fiber}g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Insights */}
          <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-6 border border-emerald-500/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Weekly Nutrition Insights</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your weekly totals: {Math.round(displayTotals.calories).toLocaleString()} calories, {Math.round(displayTotals.protein * 10) / 10}g protein, {Math.round(displayTotals.fiber * 10) / 10}g fiber. 
                  Daily averages: {dailyAverages.calories} calories, {dailyAverages.protein}g protein, {dailyAverages.fiber}g fiber.
                  {nutritionScore >= 80 
                    ? " Excellent nutrition quality this week! Keep up the great work."
                    : nutritionScore >= 60
                    ? " Good progress! Focus on increasing fiber and micronutrient density."
                    : " Consider meal planning to improve nutrition consistency."
                  }
                </p>
                <div className="flex items-center space-x-4">
                  <motion.button 
                    onClick={() => setShowOptimizePopup(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Optimize Plan
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimize Plan Popup */}
      {showOptimizePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Optimize Nutrition Plan</h3>
                  <p className="text-gray-400">AI-powered recommendations for better nutrition</p>
                </div>
              </div>
              <button
                onClick={() => setShowOptimizePopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Score Breakdown */}
            <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Current Score: {nutritionScore}/100</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <span className="text-white text-sm">Weekly Calories</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{Math.round(displayTotals.calories).toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">/ {weeklyTargets.calories.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">Weekly Protein</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{Math.round(displayTotals.protein * 10) / 10}g</div>
                    <div className="text-gray-400 text-xs">/ {weeklyTargets.protein}g</div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Weekly Fiber</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{Math.round(displayTotals.fiber * 10) / 10}g</div>
                    <div className="text-gray-400 text-xs">/ {weeklyTargets.fiber}g</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-4 mb-6">
              <h4 className="text-white font-semibold">AI Recommendations</h4>
              
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Protein Optimization</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Increase weekly protein intake by 140g (20g daily average) to reach optimal muscle synthesis. Consider adding Greek yogurt or lean fish.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Meal Timing</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Shift 30% of your weekly calories to earlier in the day to improve metabolic efficiency.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center space-x-3 mb-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold">Micronutrient Boost</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Add more colorful vegetables throughout the week to increase vitamin C and antioxidant intake by 40%.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Recommendations
              </motion.button>
              <motion.button
                onClick={() => setShowOptimizePopup(false)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NutritionOverviewCard;