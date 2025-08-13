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
import { useNutrition } from '../../hooks/useNutrition';

interface MacroData {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

interface MacroGoals {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

const MacroTrackingChart: React.FC = () => {
  const { currentEntry, loading } = useNutrition();
  
  const macroData: MacroData = {
    protein: currentEntry?.dailyTotals?.protein || 0,
    carbs: currentEntry?.dailyTotals?.carbs || 0,
    fats: currentEntry?.dailyTotals?.fats || 0,
    calories: currentEntry?.dailyTotals?.calories || 0
  };
  
  const macroGoals: MacroGoals = {
    protein: currentEntry?.goals?.protein || 150,
    carbs: currentEntry?.goals?.carbs || 200,
    fats: currentEntry?.goals?.fats || 70,
    calories: currentEntry?.goals?.calories || 2000
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 display: none">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-64 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const macros = [
    {
      name: 'Protein',
      current: macroData.protein,
      goal: macroGoals.protein,
      color: 'from-blue-500 to-cyan-500',
      unit: 'g'
    },
    {
      name: 'Carbs',
      current: macroData.carbs,
      goal: macroGoals.carbs,
      color: 'from-green-500 to-emerald-500',
      unit: 'g'
    },
    {
      name: 'Fats',
      current: macroData.fats,
      goal: macroGoals.fats,
      color: 'from-yellow-500 to-orange-500',
      unit: 'g'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 display: none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Macro Tracking</h3>
          <p className="text-gray-300">Daily macronutrient breakdown</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{macroData.calories}</div>
          <div className="text-xs text-gray-400">/ {macroGoals.calories} kcal</div>
        </div>
      </div>

      <div className="space-y-6">
        {macros.map((macro) => {
          const percentage = (macro.current / macro.goal) * 100;
          
          return (
            <div key={macro.name} className="space-y-2 display: none">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{macro.name}</span>
                <span className="text-gray-300 text-sm">
                  {Math.round(macro.current * 10) / 10}{macro.unit} / {Math.round(macro.goal * 10) / 10}{macro.unit}
                </span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-3">
                <motion.div
                  className={`bg-gradient-to-r ${macro.color} h-3 rounded-full relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{Math.round(percentage)}% of goal</span>
                <span className={`font-medium ${
                  percentage >= 100 ? 'text-green-400' :
                  percentage >= 75 ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  {percentage >= 100 ? 'Goal reached!' :
                   percentage >= 75 ? 'Almost there!' :
                   'Keep going!'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Macro Distribution Chart */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold mb-4">Today's Distribution</h4>
        <div className="grid grid-cols-3 gap-4">
          {macros.map((macro) => {
            const percentage = (macro.current / macroData.calories * 4) * 100; // Rough calorie conversion
            
            return (
              <div key={macro.name} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${macro.color} flex items-center justify-center mb-2`}>
                  <span className="text-white font-bold text-sm">{Math.round(percentage)}%</span>
                </div>
                <div className="text-white text-sm font-medium">{macro.name}</div>
                <div className="text-gray-400 text-xs">{Math.round(macro.current * 10) / 10}{macro.unit}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MacroTrackingChart;