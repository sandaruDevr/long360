import React from 'react';
import { motion } from 'framer-motion';
import { Pill, TrendingUp, Target, Shield, Brain, Heart } from 'lucide-react';
import { useSupplement } from '../../hooks/useSupplement';

const SupplementOverview: React.FC = () => {
  const { supplementStats, loading } = useSupplement();
  
  const supplementScore = supplementStats?.supplementScore || 0;
  const maxScore = 100;
  const percentage = (supplementScore / maxScore) * 100;
  const trend = supplementScore > 0 ? '+' + Math.round(supplementScore * 0.1) : '0';
  const trendPeriod = 'this week';

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

  return (
    <div className="relative overflow-hidden">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Supplement Optimization Score</h2>
              <p className="text-gray-300">Your personalized supplementation effectiveness rating</p>
            </div>
            <div className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold">{trend} {trendPeriod}</span>
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
                    stroke="url(#supplementScoreGradient)"
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
                    <linearGradient id="supplementScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#6366F1" />
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
                      {supplementScore}
                    </motion.div>
                    <div className="text-xl text-gray-300 font-semibold">/ {maxScore}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Supplement Metrics */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Adherence Rate</p>
                      <p className="text-gray-400 text-sm">daily compliance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{supplementStats?.adherenceRate || 0}%</p>
                    <p className="text-emerald-400 text-sm">
                      {(supplementStats?.adherenceRate || 0) >= 90 ? 'Excellent' :
                       (supplementStats?.adherenceRate || 0) >= 75 ? 'Good' : 'Needs improvement'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Coverage Score</p>
                      <p className="text-gray-400 text-sm">nutrient gaps filled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{supplementStats?.coverageScore || 0}%</p>
                    <p className="text-emerald-400 text-sm">
                      {(supplementStats?.coverageScore || 0) >= 80 ? 'Comprehensive' :
                       (supplementStats?.coverageScore || 0) >= 60 ? 'Good coverage' : 'Basic coverage'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Synergy Index</p>
                      <p className="text-gray-400 text-sm">interaction optimization</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{supplementStats?.synergyIndex || 0}%</p>
                    <p className="text-emerald-400 text-sm">
                      {(supplementStats?.synergyIndex || 0) >= 80 ? 'Well optimized' :
                       (supplementStats?.synergyIndex || 0) >= 60 ? 'Good synergy' : 'Room for improvement'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Supplement Insight */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Supplement Insight</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {supplementStats?.activeSupplements === 0 
                    ? "Start building your supplement protocol by adding your first supplement. Our AI will provide personalized optimization insights as you track more data."
                    : supplementStats && supplementStats.supplementScore >= 80
                    ? "Your supplement protocol is well-optimized. Continue monitoring adherence and consider periodic biomarker testing to validate effectiveness."
                    : "Your supplement protocol has room for optimization. Focus on improving adherence and consider adding complementary nutrients for better synergy."
                  }
                </p>
                <div className="flex items-center space-x-4">
                  <motion.button 
                    className="bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 px-4 py-2 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {supplementStats?.activeSupplements === 0 ? 'Get Started' : 'View Recommendations'}
                  </motion.button>
                  <motion.button 
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {supplementStats?.activeSupplements === 0 ? 'Learn More' : 'Optimize Protocol'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementOverview;