import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, TrendingUp, Calendar, CheckCircle, Trophy, Star, Zap } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';

const WorkoutAchievements: React.FC = () => {
  const { achievements, loading } = useWorkout();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/20 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedAchievements = achievements.filter(a => a.isUnlocked).length;
  const inProgressAchievements = achievements.filter(a => !a.isUnlocked && a.currentProgress > 0).length;

  const getStatusColor = (achievement: any) => {
    if (achievement.isUnlocked) return 'text-emerald-400 bg-emerald-500/20';
    if (achievement.currentProgress > 0) return 'text-blue-400 bg-blue-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  const getStatusText = (achievement: any) => {
    if (achievement.isUnlocked) return 'Completed';
    if (achievement.currentProgress > 0) return 'In Progress';
    return 'Locked';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case 'common': return '🥉';
      case 'rare': return '🥈';
      case 'epic': return '🥇';
      case 'legendary': return '👑';
      default: return '🏆';
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'strength': return '💪';
      case 'endurance': return '🏃';
      case 'consistency': return '🎯';
      case 'milestone': return '🚀';
      default: return '🏆';
    }
  };

  return (
    <div className="space-y-6">
      {/* Achievements Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Workout Achievements</h3>
            <p className="text-gray-300">{completedAchievements} completed • {inProgressAchievements} in progress</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{completedAchievements}</div>
              <div className="text-xs text-gray-400">Achieved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{inProgressAchievements}</div>
              <div className="text-xs text-gray-400">Active</div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {achievements.filter(a => a.rarity === 'legendary' && a.isUnlocked).length}
            </div>
            <div className="text-gray-400 text-sm">Legendary</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {achievements.filter(a => a.rarity === 'epic' && a.isUnlocked).length}
            </div>
            <div className="text-gray-400 text-sm">Epic</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {achievements.filter(a => a.rarity === 'rare' && a.isUnlocked).length}
            </div>
            <div className="text-gray-400 text-sm">Rare</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">
              {achievements.filter(a => a.rarity === 'common' && a.isUnlocked).length}
            </div>
            <div className="text-gray-400 text-sm">Common</div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border transition-all hover:bg-white/10 ${
              achievement.isUnlocked ? 'border-emerald-500/30' : 
              achievement.currentProgress > 0 ? 'border-blue-500/30' : 'border-white/10'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 relative text-2xl">
                {achievement.icon}
                {achievement.isUnlocked && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeEmoji(achievement.type)}</span>
                    <h4 className="font-semibold text-white truncate">{achievement.title}</h4>
                    <span className={`text-lg ${getRarityColor(achievement.rarity)}`}>
                      {getRarityEmoji(achievement.rarity)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(achievement)}`}>
                    {getStatusText(achievement)}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{achievement.description}</p>

                {!achievement.isUnlocked && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs text-white font-medium">
                        {achievement.currentProgress}/{achievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.currentProgress / achievement.requirement) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {achievement.isUnlocked && achievement.unlockedAt 
                        ? `Unlocked: ${new Date(achievement.unlockedAt).toLocaleDateString()}`
                        : `Progress: ${achievement.currentProgress}/${achievement.requirement}`
                      }
                    </span>
                  </div>

                  <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)} capitalize`}>
                    {achievement.rarity}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h4 className="text-white font-semibold">Achievement Progress</h4>
          </div>
          <p className="text-gray-300 text-sm">
            You're on track to become a Fitness Legend! Complete your current challenges to unlock advanced 
            training features and earn exclusive badges. Your consistency is paying off!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutAchievements;