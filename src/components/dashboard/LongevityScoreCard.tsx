import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Heart, Brain, Moon, Target } from 'lucide-react';
import { LongevityMetrics } from '../../hooks/useLongevityData';

interface LongevityScoreCardProps extends LongevityMetrics {
  sleepStats: any; // Assuming structure from useSleep hook
  workoutStats: any; // Assuming structure from useWorkout hook
}

const LongevityScoreCard: React.FC<LongevityScoreCardProps> = ({
  longevityScore,
  biologicalAge,
  healthspan,
  vitalityIndex,
  sleepStats,
  workoutStats,
  loading
}) => {
  const maxScore = 10;
  const percentage = (longevityScore / maxScore) * 100;
  const trendPeriod = 'this month'; // This is a placeholder, actual trend would need historical data
  return (
    <div className="relative overflow-hidden">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Longevity Score</h2>
              <p className="text-gray-300">Your overall health optimization rating</p>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-500/30"> 
              {/* Trend calculation: Simple positive trend if score is good, otherwise neutral. 
                  A real trend would require historical data. */}
              {loading ? '...' : (longevityScore >= 7.5 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : null)}
              <span className="text-emerald-400 font-semibold">{loading ? '...' : (longevityScore >= 7.5 ? `+${(longevityScore - 7.0).toFixed(1)}` : 'Stable')} {trendPeriod}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Score Display */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                {/* Animated Ring */}
                <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                  {/* Background Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress Ring */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="95"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 100}`}
                    strokeDashoffset={`${2 * Math.PI * 100 * (1 - percentage / 100)}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - percentage / 100) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div 
                      className="text-7xl font-black text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, duration: 0.5, type: "spring" }}
                    >
                      {loading ? '...' : longevityScore}
                    </motion.div>
                    <div className="text-2xl text-gray-300 font-semibold">/ {maxScore}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Biological Age</p>
                      <p className="text-gray-400 text-sm">vs chronological age</p>
                    </div>
                  </div> 
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{loading ? '...' : biologicalAge}</p> 
                    <p className="text-emerald-400 text-sm">{loading ? '...' : (biologicalAge < 35 ? `-${(35 - biologicalAge).toFixed(0)} years` : 'Optimized')}</p> 
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Healthspan</p>
                      <p className="text-gray-400 text-sm">projected years</p>
                    </div>
                  </div> 
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{loading ? '...' : healthspan}</p> 
                    <p className="text-emerald-400 text-sm">{loading ? '...' : (healthspan > 80 ? `+${(healthspan - 80).toFixed(0)} years` : 'Projected')}</p> 
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Vitality Index</p>
                      <p className="text-gray-400 text-sm">energy & recovery</p>
                    </div>
                  </div> 
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{loading ? '...' : `${vitalityIndex}%`}</p> 
                    <p className="text-emerald-400 text-sm">{loading ? '...' : (vitalityIndex >= 85 ? 'High' : 'Good')}</p> 
                  </div>
                </div>
              </div>

              {/* New Card 1: Average Sleep Score */}
             

              {/* New Card 2: Workout Consistency */}
       
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongevityScoreCard;
