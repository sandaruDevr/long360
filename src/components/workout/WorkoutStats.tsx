import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Zap, Target, Calendar, Award } from 'lucide-react';

interface Stat {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const stats: Stat[] = [
  {
    id: '1',
    title: 'Total Workouts',
    value: '47',
    change: '+8 this month',
    trend: 'up',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    description: 'completed sessions'
  },
  {
    id: '2',
    title: 'Training Volume',
    value: '16.5K',
    change: '+12% vs last month',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    description: 'total pounds lifted'
  },
  {
    id: '3',
    title: 'Avg Duration',
    value: '48 min',
    change: '+3 min',
    trend: 'up',
    icon: Clock,
    color: 'from-purple-500 to-pink-500',
    description: 'per workout'
  },
  {
    id: '4',
    title: 'Calories Burned',
    value: '12.8K',
    change: '+15% this month',
    trend: 'up',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    description: 'total calories'
  },
  {
    id: '5',
    title: 'Consistency',
    value: '87%',
    change: '+5% improvement',
    trend: 'up',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    description: 'workout adherence'
  },
  {
    id: '6',
    title: 'Personal Records',
    value: '12',
    change: '+4 this month',
    trend: 'up',
    icon: Award,
    color: 'from-yellow-500 to-orange-500',
    description: 'new PRs achieved'
  }
];

const WorkoutStats: React.FC = () => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Workout Statistics</h3>
          <p className="text-gray-300">Your fitness performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{stat.title}</h4>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
                    stat.trend === 'down' ? 'bg-red-500/20 text-red-400' : 
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-gray-400 text-sm">{stat.description}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h4 className="text-white font-semibold">This Week's Performance</h4>
          </div>
          <p className="text-gray-300 text-sm">
            Outstanding progress! You've completed 5 workouts this week, burned 2,340 calories, 
            and achieved 2 new personal records. Keep up the excellent consistency!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStats;