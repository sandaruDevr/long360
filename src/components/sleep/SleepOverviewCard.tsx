import React from 'react';
import { motion } from 'framer-motion';
import { Moon, TrendingUp, Clock, Zap, Brain, Heart, Sparkles } from 'lucide-react';
import { SleepStats, SleepEntry } from '../../types/sleep';

interface SleepOverviewCardProps {
  sleepStats: SleepStats | null;
  latestEntry: SleepEntry | null;
  sleepEntries: SleepEntry[];
  loading: boolean;
}

const SleepOverviewCard: React.FC<SleepOverviewCardProps> = ({ sleepStats, latestEntry, sleepEntries, loading }) => {
  const sleepScore = latestEntry?.sleepScore || sleepStats?.averageSleepScore || 0;
  const maxScore = 100;
  const percentage = (sleepScore / maxScore) * 100;
  const trend = sleepStats?.currentStreak ? `+${sleepStats.currentStreak}` : '0';
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Sleep Quality Score</h2>
              <p className="text-gray-300">Your overall sleep optimization rating</p>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-indigo-500/30">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-400 font-semibold">{trend} {trendPeriod}</span>
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
                    stroke="url(#sleepScoreGradient)"
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
                    <linearGradient id="sleepScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
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
                      {sleepScore}
                    </motion.div>
                    <div className="text-xl text-gray-300 font-semibold">/ {maxScore}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Sleep Metrics */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Total Sleep</p>
                      <p className="text-gray-400 text-sm">last night</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {latestEntry ? `${Math.floor(latestEntry.totalSleep)}h ${Math.round((latestEntry.totalSleep % 1) * 60)}m` : 'No data'}
                    </p>
                    <p className="text-indigo-400 text-sm">
                      {sleepStats ? `Avg: ${sleepStats.averageSleepDuration}h` : 'No average'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Deep Sleep</p>
                      <p className="text-gray-400 text-sm">restorative phase</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {latestEntry ? `${Math.floor(latestEntry.sleepStages.deep)}h ${Math.round((latestEntry.sleepStages.deep % 1) * 60)}m` : 'No data'}
                    </p>
                    <p className="text-emerald-400 text-sm">
                      {sleepStats ? `Avg: ${sleepStats.averageDeepSleep}h` : 'No average'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Sleep Efficiency</p>
                      <p className="text-gray-400 text-sm">time asleep vs in bed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {latestEntry ? `${latestEntry.sleepEfficiency}%` : sleepStats ? `${sleepStats.averageEfficiency}%` : '0%'}
                    </p>
                    <p className="text-emerald-400 text-sm">
                      {sleepStats && sleepStats.averageEfficiency >= 90 ? 'Excellent' : 
                       sleepStats && sleepStats.averageEfficiency >= 80 ? 'Good' : 'Needs improvement'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Sleep Insight */}
          {latestEntry?.aiInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Sleep Analysis</h3>
                  <p className="text-purple-200 text-sm">Confidence: {latestEntry.aiInsights.confidenceScore}%</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Overall Analysis */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="text-white font-semibold mb-2">Overall Analysis</h5>
                  <p className="text-gray-300 leading-relaxed">{latestEntry.aiInsights.overallAnalysis}</p>
                </div>

                {/* Personalized Tips */}
                {latestEntry.aiInsights.personalizedTips.length > 0 && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-3">Key Recommendations</h5>
                    <div className="space-y-2">
                      {latestEntry.aiInsights.personalizedTips.slice(0, 3).map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Regular Sleep Insight without AI */}
          {!latestEntry?.aiInsights && (
            <div className="mt-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sleep Insight</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {sleepStats && sleepEntries.length > 0 ? (
                      sleepStats.currentStreak > 0 
                        ? `Great consistency! You're on a ${sleepStats.currentStreak}-day quality sleep streak. Your average sleep score of ${sleepStats.averageSleepScore} shows excellent optimization.`
                        : sleepStats.averageSleepScore >= 80
                        ? `Good sleep quality with an average score of ${sleepStats.averageSleepScore}. Focus on consistency to build a strong streak.`
                        : `Your sleep quality can be improved. Current average score is ${sleepStats.averageSleepScore}. Consider optimizing your sleep environment and routine.`
                    ) : latestEntry ? (
                      `Your sleep score of ${latestEntry.sleepScore} shows ${
                        latestEntry.sleepScore >= 85 ? 'excellent sleep optimization. Keep up the great work!' :
                        latestEntry.sleepScore >= 70 ? 'good sleep quality with room for improvement.' :
                        'significant opportunities for sleep optimization.'
                      } Consider adding detailed notes to your next sleep entry for AI-powered personalized insights.`
                    ) : (
                      'Start tracking your sleep to receive personalized insights and optimization recommendations.'
                    )}
                  </p>
                  <motion.button 
                    className="mt-4 bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-300 px-4 py-2 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Detailed Analysis
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SleepOverviewCard;