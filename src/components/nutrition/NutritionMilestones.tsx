import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, TrendingUp, Calendar, CheckCircle, Apple, Trophy, Star } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  progress?: number;
  icon: React.ComponentType<any>;
  color: string;
  category: 'quality' | 'consistency' | 'macros' | 'micronutrients';
}

const milestones: Milestone[] = [
  {
    id: '1',
    title: 'Nutrition Quality Master',
    description: 'Achieved 85+ nutrition score for 7 consecutive days',
    date: '2024-12-10',
    status: 'completed',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    category: 'quality'
  },
  {
    id: '2',
    title: 'Protein Consistency Champion',
    description: 'Met daily protein goals for 30 consecutive days',
    date: '2024-12-05',
    status: 'completed',
    icon: Award,
    color: 'from-blue-500 to-cyan-500',
    category: 'macros'
  },
  {
    id: '3',
    title: 'Micronutrient Optimizer',
    description: 'Achieve 90%+ micronutrient coverage for 14 days',
    date: '2024-12-20',
    status: 'in-progress',
    progress: 78,
    icon: Target,
    color: 'from-emerald-500 to-teal-500',
    category: 'micronutrients'
  },
  {
    id: '4',
    title: 'Hydration Hero',
    description: 'Meet daily hydration goals for 21 consecutive days',
    date: '2024-12-25',
    status: 'in-progress',
    progress: 65,
    icon: Apple,
    color: 'from-cyan-500 to-blue-500',
    category: 'consistency'
  },
  {
    id: '5',
    title: 'Anti-Inflammatory Expert',
    description: 'Maintain anti-inflammatory diet score >85 for 30 days',
    date: '2025-01-01',
    status: 'upcoming',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    category: 'quality'
  },
  {
    id: '6',
    title: 'Nutrition Streak Legend',
    description: 'Complete 100 consecutive days of optimal nutrition',
    date: '2025-02-15',
    status: 'upcoming',
    icon: Star,
    color: 'from-pink-500 to-rose-500',
    category: 'consistency'
  }
];

const NutritionMilestones: React.FC = () => {
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const inProgressMilestones = milestones.filter(m => m.status === 'in-progress').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'in-progress': return 'text-blue-400 bg-blue-500/20';
      case 'upcoming': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      default: return 'Unknown';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'quality': return '⭐';
      case 'consistency': return '🎯';
      case 'macros': return '💪';
      case 'micronutrients': return '🌟';
      default: return '🏆';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Nutrition Achievements</h3>
          <p className="text-gray-300">{completedMilestones} completed • {inProgressMilestones} in progress</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{completedMilestones}</div>
            <div className="text-xs text-gray-400">Achieved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{inProgressMilestones}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all hover:bg-white/10 ${
              milestone.status === 'completed' ? 'border-emerald-500/30' : 
              milestone.status === 'in-progress' ? 'border-blue-500/30' : 'border-white/10'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${milestone.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <milestone.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCategoryEmoji(milestone.category)}</span>
                    <h4 className="font-semibold text-white truncate">{milestone.title}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {getStatusText(milestone.status)}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{milestone.description}</p>

                {milestone.progress && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs text-white font-medium">{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className={`bg-gradient-to-r ${milestone.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {milestone.status === 'completed' ? 'Completed' : 'Target'}: {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>

                  {milestone.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-semibold">Achievement Progress</h4>
          </div>
          <p className="text-gray-300 text-sm">
            You're on track to become a Nutrition Master! Complete your current milestones to unlock advanced 
            nutrition optimization features and earn exclusive badges.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionMilestones;