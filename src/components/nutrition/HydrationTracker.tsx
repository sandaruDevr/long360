import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, Target, TrendingUp, Minus } from 'lucide-react';
import { useNutrition } from '../../hooks/useNutrition';

const HydrationTracker: React.FC = () => {
  const { currentEntry, updateWaterIntake, loading } = useNutrition();
  const [localWaterIntake, setLocalWaterIntake] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const dailyGoal = currentEntry?.hydration.target || 2.5;
  const currentIntake = currentEntry?.hydration.waterIntake || 0;
  
  useEffect(() => {
    setLocalWaterIntake(currentIntake);
  }, [currentIntake]);

  const percentage = (localWaterIntake / dailyGoal) * 100;
  const glassSize = 0.25; // 250ml per glass
  const glasses = Math.round(localWaterIntake / glassSize);

  const addGlass = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
    const newIntake = Math.min(localWaterIntake + glassSize, dailyGoal + 1);
    setLocalWaterIntake(newIntake);
    await updateWaterIntake(newIntake);
    } catch (error) {
      console.error('Error adding water:', error);
      // Revert on error
      setLocalWaterIntake(localWaterIntake);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeGlass = async () => {
    if (isUpdating || localWaterIntake <= 0) return;
    setIsUpdating(true);
    
    try {
      const newIntake = Math.max(localWaterIntake - glassSize, 0);
      setLocalWaterIntake(newIntake);
      await updateWaterIntake(newIntake);
    } catch (error) {
      console.error('Error removing water:', error);
      // Revert on error
      setLocalWaterIntake(localWaterIntake);
    } finally {
      setIsUpdating(false);
    }
  };

  const addCustomAmount = async (amount: number) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
    const newIntake = Math.min(localWaterIntake + amount, dailyGoal + 2);
    setLocalWaterIntake(newIntake);
    await updateWaterIntake(newIntake);
    } catch (error) {
      console.error('Error adding custom amount:', error);
      // Revert on error
      setLocalWaterIntake(localWaterIntake);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-48 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Hydration Tracker</h3>
          <p className="text-gray-300">Daily water intake goal</p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">{Math.round(localWaterIntake * 10) / 10}L</div>
          <div className="text-xs text-gray-400">/ {dailyGoal}L</div>
        </div>
      </div>

      {/* Water Level Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Water Bottle */}
          <div className="w-24 h-48 bg-white/10 rounded-2xl border-2 border-white/20 relative overflow-hidden">
            {/* Water Level */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-b-2xl"
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* Water Surface Animation */}
            <motion.div
              className="absolute left-0 right-0 h-2 bg-gradient-to-r from-cyan-300 to-blue-300 opacity-60"
              style={{ bottom: `${Math.min(percentage, 100)}%` }}
              animate={{ 
                scaleX: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Measurement Lines */}
            {[25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="absolute left-0 right-0 h-px bg-white/20"
                style={{ bottom: `${mark}%` }}
              />
            ))}
          </div>

          {/* Percentage Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-white font-bold text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {Math.round(percentage)}%
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <motion.button
          onClick={removeGlass}
          className="w-12 h-12 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl flex items-center justify-center transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={localWaterIntake <= 0 || isUpdating}
        >
          <Minus className="w-6 h-6 text-red-400" />
        </motion.button>

        <div className="text-center">
          <div className="text-3xl">💧</div>
          <div className="text-white font-semibold">{glasses} glasses</div>
          <div className="text-gray-400 text-xs">250ml each</div>
        </div>

        <motion.button
          onClick={addGlass}
          className="w-12 h-12 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl flex items-center justify-center transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isUpdating}
        >
          <Plus className="w-6 h-6 text-cyan-400" />
        </motion.button>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[0.1, 0.25, 0.5, 1.0].map((amount) => (
          <motion.button
            key={amount}
            onClick={() => addCustomAmount(amount)}
            className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg py-2 text-white text-sm font-medium transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUpdating}
          >
            +{amount}L
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Daily Progress</span>
          <span className="text-sm font-semibold text-white">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8 }}
          >
            {/* Shimmer Effect */}
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
      </div>

      {/* Hydration Stats */}
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <div className="text-lg font-bold text-cyan-400">{glasses}</div>
          <div className="text-xs text-gray-400">Glasses Today</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-400">
            {Math.round(Math.max(0, (dailyGoal - localWaterIntake)) * 10) / 10}L
          </div>
          <div className="text-xs text-gray-400">Remaining</div>
        </div>
        <div>
          <div className="text-lg font-bold text-emerald-400">
            {percentage >= 100 ? '🎉' : percentage >= 75 ? '💪' : '🚰'}
          </div>
          <div className="text-xs text-gray-400">
            {percentage >= 100 ? 'Goal Reached!' : percentage >= 75 ? 'Almost There!' : 'Keep Going!'}
          </div>
        </div>
      </div>

      {/* Hydration Tips */}
      <AnimatePresence>
        {percentage < 50 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Droplets className="w-4 h-4" />
              <span>💡 Hydration Tip</span>
            </h4>
            <p className="text-gray-300 text-sm">
              {percentage < 25 
                ? "Start your day with a glass of water to kickstart hydration and boost metabolism."
                : "Set hourly reminders to drink water throughout the day for consistent hydration."
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement */}
      <AnimatePresence>
        {percentage >= 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>🎉 Daily Goal Achieved!</span>
            </h4>
            <p className="text-gray-300 text-sm">
              Excellent hydration today! Proper hydration supports metabolism, brain function, and overall health.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HydrationTracker;