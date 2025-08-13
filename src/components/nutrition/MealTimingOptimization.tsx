import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Sunset, Moon, TrendingUp, Target, Zap } from 'lucide-react';

interface MealTiming {
  id: string;
  meal: string;
  currentTime: string;
  optimalTime: string;
  reason: string;
  impact: string;
  icon: React.ComponentType<any>;
  color: string;
}

const mealTimings: MealTiming[] = [
  {
    id: '1',
    meal: 'Breakfast',
    currentTime: '8:30 AM',
    optimalTime: '7:00 AM',
    reason: 'Earlier breakfast kickstarts metabolism and improves insulin sensitivity',
    impact: '+15% metabolic boost',
    icon: Sun,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '2',
    meal: 'Lunch',
    currentTime: '1:00 PM',
    optimalTime: '12:00 PM',
    reason: 'Peak digestive capacity occurs around noon for optimal nutrient absorption',
    impact: '+20% nutrient absorption',
    icon: Sun,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: '3',
    meal: 'Dinner',
    currentTime: '8:00 PM',
    optimalTime: '6:30 PM',
    reason: 'Earlier dinner improves sleep quality and overnight recovery',
    impact: '+25% sleep quality',
    icon: Sunset,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '4',
    meal: 'Evening Snack',
    currentTime: '10:00 PM',
    optimalTime: 'Skip',
    reason: 'Late eating disrupts circadian rhythm and fat metabolism',
    impact: '+10% fat burning',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500'
  }
];

const MealTimingOptimization: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const getTimeDifference = (current: string, optimal: string) => {
    if (optimal === 'Skip') return 'Eliminate';
    
    const currentTime = new Date(`2024-01-01 ${current}`);
    const optimalTime = new Date(`2024-01-01 ${optimal}`);
    const diffMs = currentTime.getTime() - optimalTime.getTime();
    const diffHours = Math.abs(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.abs(diffMs / (1000 * 60));
      return `${Math.round(diffMinutes)} min ${diffMs > 0 ? 'late' : 'early'}`;
    }
    
    return `${diffHours.toFixed(1)}h ${diffMs > 0 ? 'late' : 'early'}`;
  };

  const getOptimizationScore = () => {
    let score = 0;
    mealTimings.forEach(timing => {
      if (timing.optimalTime === 'Skip' && timing.currentTime === '10:00 PM') {
        score += 0; // Not optimal
      } else if (timing.optimalTime !== 'Skip') {
        const current = new Date(`2024-01-01 ${timing.currentTime}`);
        const optimal = new Date(`2024-01-01 ${timing.optimalTime}`);
        const diffHours = Math.abs(current.getTime() - optimal.getTime()) / (1000 * 60 * 60);
        score += Math.max(0, 25 - (diffHours * 5)); // Max 25 points per meal
      }
    });
    return Math.round(score);
  };

  const optimizationScore = getOptimizationScore();

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Meal Timing Optimization</h3>
          <p className="text-gray-300">Align your eating schedule with circadian rhythms</p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{optimizationScore}%</div>
          <div className="text-xs text-gray-400">Timing Score</div>
        </div>
      </div>

      {/* Circadian Rhythm Visualization */}
      <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Your Circadian Eating Window</span>
        </h4>
        
        <div className="relative">
          {/* Timeline */}
          <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>12 AM</span>
          </div>
          
          <div className="relative h-8 bg-gradient-to-r from-blue-900/50 via-yellow-500/30 via-orange-500/30 to-blue-900/50 rounded-full">
            {/* Optimal eating window */}
            <div className="absolute left-[8%] right-[25%] top-1 bottom-1 bg-emerald-500/40 rounded-full"></div>
            
            {/* Current meal markers */}
            <div className="absolute left-[21%] top-0 bottom-0 w-1 bg-yellow-400 rounded-full" title="Current Breakfast"></div>
            <div className="absolute left-[54%] top-0 bottom-0 w-1 bg-emerald-400 rounded-full" title="Current Lunch"></div>
            <div className="absolute left-[83%] top-0 bottom-0 w-1 bg-red-400 rounded-full" title="Current Dinner"></div>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-emerald-400">Optimal Window</span>
            <span className="text-gray-400">Current Schedule</span>
          </div>
        </div>
      </div>

      {/* Meal Timing Cards */}
      <div className="space-y-4">
        {mealTimings.map((timing, index) => (
          <motion.div
            key={timing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
              selectedMeal === timing.id ? 'border-emerald-500/30 bg-emerald-500/10' : ''
            }`}
            onClick={() => setSelectedMeal(selectedMeal === timing.id ? null : timing.id)}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${timing.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <timing.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{timing.meal}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 text-sm font-medium">{timing.impact}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getTimeDifference(timing.currentTime, timing.optimalTime).includes('late') 
                        ? 'bg-red-500/20 text-red-400'
                        : getTimeDifference(timing.currentTime, timing.optimalTime) === 'Eliminate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {getTimeDifference(timing.currentTime, timing.optimalTime)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-400 text-xs">Current Time</p>
                    <p className="text-white font-medium">{timing.currentTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Optimal Time</p>
                    <p className="text-emerald-400 font-medium">{timing.optimalTime}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">{timing.reason}</p>

                {selectedMeal === timing.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg p-3 border border-emerald-500/30">
                      <h5 className="text-white font-semibold mb-2">💡 Optimization Tip</h5>
                      <p className="text-gray-300 text-sm">
                        {timing.meal === 'Breakfast' && 'Try setting an earlier alarm and preparing overnight oats for quick, nutritious mornings.'}
                        {timing.meal === 'Lunch' && 'Schedule lunch breaks earlier to align with your natural digestive peak.'}
                        {timing.meal === 'Dinner' && 'Aim to finish dinner 3-4 hours before bedtime for better sleep and recovery.'}
                        {timing.meal === 'Evening Snack' && 'Replace late snacks with herbal tea or practice intermittent fasting for better metabolic health.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optimization Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-semibold">Timing Optimization Impact</h4>
          </div>
          <p className="text-gray-300 text-sm">
            Optimizing your meal timing could improve your metabolic efficiency by up to 25% and enhance 
            sleep quality. Small adjustments to your eating schedule align with natural circadian rhythms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealTimingOptimization;