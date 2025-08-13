import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award,
  Star,
  Calendar,
  Clock,
  Moon,
  Brain,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SleepEntry, SleepAchievement } from '../../types/sleep';

interface SleepMilestonesProps {
  achievements: SleepAchievement[];
  sleepEntries: SleepEntry[];
  loading?: boolean;
}

const SleepMilestones: React.FC<SleepMilestonesProps> = ({
  achievements = [],
  sleepEntries = [],
  loading = false
}) => {
  const { t } = useTranslation();

  // Calculate milestone progress
  const calculateMilestones = () => {
    if (!sleepEntries || sleepEntries.length === 0) {
      return {
        totalNights: 0,
        averageScore: 0,
        bestStreak: 0,
        currentStreak: 0,
        qualityNights: 0
      };
    }

    const totalNights = sleepEntries.length;
    const averageScore = Math.round(
      sleepEntries.reduce((sum, entry) => sum + (entry.sleepScore || 0), 0) / totalNights
    );
    
    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const sortedEntries = [...sleepEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Current streak (from most recent)
    for (const entry of sortedEntries) {
      if ((entry.sleepScore || 0) >= 70) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Best streak
    for (const entry of sleepEntries) {
      if ((entry.sleepScore || 0) >= 70) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    const qualityNights = sleepEntries.filter(entry => (entry.sleepScore || 0) >= 80).length;
    
    return {
      totalNights,
      averageScore,
      bestStreak,
      currentStreak,
      qualityNights
    };
  };

  const milestones = calculateMilestones();

  const milestoneCards = [
    {
      id: 'total-nights',
      title: 'Total Nights Tracked',
      value: milestones.totalNights,
      target: 30,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600',
      description: 'Consistency is key to better sleep'
    },
    {
      id: 'average-score',
      title: 'Average Sleep Score',
      value: milestones.averageScore,
      target: 85,
      icon: Star,
      color: 'from-purple-500 to-pink-600',
      description: 'Overall sleep quality rating'
    },
    {
      id: 'best-streak',
      title: 'Best Quality Streak',
      value: milestones.bestStreak,
      target: 7,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-600',
      description: 'Consecutive nights with 70+ score'
    },
    {
      id: 'current-streak',
      title: 'Current Streak',
      value: milestones.currentStreak,
      target: 7,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      description: 'Keep the momentum going!'
    },
    {
      id: 'quality-nights',
      title: 'Excellent Nights',
      value: milestones.qualityNights,
      target: 20,
      icon: Award,
      color: 'from-indigo-500 to-purple-600',
      description: 'Nights with 80+ sleep score'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Sleep Milestones</h3>
            <p className="text-gray-300 text-sm">Track your sleep achievements</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-8 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Sleep Milestones</h3>
          <p className="text-gray-300 text-sm">Track your sleep achievements and progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestoneCards.map((milestone) => {
          const progress = Math.min((milestone.value / milestone.target) * 100, 100);
          const IconComponent = milestone.icon;
          
          return (
            <motion.div
              key={milestone.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${milestone.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{milestone.value}</div>
                  <div className="text-xs text-gray-400">/ {milestone.target}</div>
                </div>
              </div>
              
              <h4 className="font-semibold text-white mb-2">{milestone.title}</h4>
              <p className="text-gray-300 text-sm mb-4">{milestone.description}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-2 bg-gradient-to-r ${milestone.color} rounded-full`}
                />
              </div>
              <div className="text-xs text-gray-400 text-right">{Math.round(progress)}% complete</div>
            </motion.div>
          );
        })}
      </div>

     

      {/* AI-Enhanced Achievements */}
      {sleepEntries.some(entry => entry.aiInsights) && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI-Enhanced Sleep Tracking
          </h4>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">AI Sleep Optimizer</h5>
                <p className="text-purple-200 text-sm">
                  You've unlocked AI-powered sleep analysis! {sleepEntries.filter(e => e.aiInsights).length} entries analyzed with personalized insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SleepMilestones;