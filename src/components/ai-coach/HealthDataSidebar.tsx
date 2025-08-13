import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Brain, 
  Zap, 
  Moon, 
  Apple, 
  TrendingUp,
  Target,
  Clock,
  Shield
} from 'lucide-react';

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    title: 'Longevity Score',
    value: '8.7',
    change: '+0.3',
    trend: 'up',
    icon: Activity,
    color: 'from-emerald-500 to-teal-500',
    description: 'Overall health optimization'
  },
  {
    id: '2',
    title: 'Sleep Quality',
    value: '85',
    change: '+5',
    trend: 'up',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    description: 'Last night performance'
  },
  {
    id: '3',
    title: 'Nutrition Score',
    value: '88%',
    change: '+7%',
    trend: 'up',
    icon: Apple,
    color: 'from-emerald-500 to-green-500',
    description: 'Daily nutrition quality'
  },
  {
    id: '4',
    title: 'Recovery Rate',
    value: '92%',
    change: '+8%',
    trend: 'up',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    description: 'Physical recovery status'
  },
  {
    id: '5',
    title: 'Cognitive Score',
    value: '94',
    change: '+2',
    trend: 'up',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    description: 'Mental performance'
  },
  {
    id: '6',
    title: 'Energy Level',
    value: '87%',
    change: '+12%',
    trend: 'up',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    description: 'Daily vitality index'
  }
];

const HealthDataSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white/5 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Live Health Data</h3>
        <p className="text-gray-300 text-sm">Real-time metrics for AI analysis</p>
      </div>

      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white text-sm truncate">{metric.title}</h4>
                  <div className={`flex items-center space-x-1 text-xs font-medium ${
                    metric.trend === 'up' ? 'text-emerald-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{metric.change}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-white">{metric.value}</div>
                </div>

                <p className="text-gray-400 text-xs mt-1">{metric.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold mb-4">Quick Insights</h4>
        
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg p-3 border border-emerald-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-sm">Trending Up</span>
            </div>
            <p className="text-gray-300 text-xs">
              Your sleep quality improved 15% this week. Great consistency!
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm">Goal Progress</span>
            </div>
            <p className="text-gray-300 text-xs">
              87% towards your monthly fitness target. You're on track!
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm">AI Recommendation</span>
            </div>
            <p className="text-gray-300 text-xs">
              Consider adding 10 minutes of morning sunlight exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Data Sync Status */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold mb-4">Data Sources</h4>
        
        <div className="space-y-2">
          {[
            { name: 'Apple Watch', status: 'synced', time: '2 min ago' },
            { name: 'Oura Ring', status: 'synced', time: '5 min ago' },
            { name: 'Lab Results', status: 'syncing', time: 'now' },
            { name: '23andMe', status: 'synced', time: '1 day ago' }
          ].map((source, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{source.name}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  source.status === 'synced' ? 'bg-emerald-400' : 
                  source.status === 'syncing' ? 'bg-blue-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <span className="text-gray-400 text-xs">{source.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthDataSidebar;