import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Zap, Shield, TrendingUp, TrendingDown } from 'lucide-react';

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
    title: 'Biological Age',
    value: '28',
    change: '-2 years',
    trend: 'up',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'vs chronological age'
  },
  {
    id: '2',
    title: 'Cognitive Score',
    value: '94',
    change: '+5 points',
    trend: 'up',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    description: 'mental performance'
  },
  {
    id: '3',
    title: 'Energy Level',
    value: '87%',
    change: '+12%',
    trend: 'up',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    description: 'daily vitality'
  },
  {
    id: '4',
    title: 'Immune Health',
    value: '92',
    change: '+3 points',
    trend: 'up',
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    description: 'immune system strength'
  }
];

const QuickStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 
              stat.trend === 'down' ? 'bg-red-500/20 text-red-400' : 
              'bg-gray-500/20 text-gray-400'
            }`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : stat.trend === 'down' ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              <span>{stat.change}</span>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-lg font-semibold text-white mb-1">{stat.title}</h3>
            <p className="text-gray-400 text-sm">{stat.description}</p>
          </div>

          <div className="text-3xl font-bold text-white mb-2">
            {stat.value}
          </div>

          {/* Mini progress indicator */}
          <div className="w-full bg-white/10 rounded-full h-1">
            <motion.div
              className={`bg-gradient-to-r ${stat.color} h-1 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${parseInt(stat.value)}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStats;