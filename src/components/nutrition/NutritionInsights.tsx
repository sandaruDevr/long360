import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, ChevronRight, Zap } from 'lucide-react';

interface Insight {
  id: string;
  type: 'optimization' | 'deficiency' | 'timing' | 'interaction';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
  color: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'optimization',
    title: 'Increase Omega-3 Rich Foods',
    description: 'Your genetic profile suggests higher omega-3 needs. Add fatty fish 2-3x per week.',
    action: 'View Meal Plans',
    priority: 'high',
    icon: Lightbulb,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    type: 'timing',
    title: 'Optimize Meal Timing',
    description: 'Eating your largest meal earlier in the day could improve metabolism by 15%.',
    action: 'Adjust Schedule',
    priority: 'medium',
    icon: Brain,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: '3',
    type: 'deficiency',
    title: 'Vitamin D Insufficiency Risk',
    description: 'Your current intake may not meet optimal levels. Consider supplementation.',
    action: 'Add Supplement',
    priority: 'high',
    icon: AlertTriangle,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '4',
    type: 'interaction',
    title: 'Iron Absorption Enhancement',
    description: 'Pair iron-rich foods with vitamin C sources to boost absorption by 300%.',
    action: 'Learn More',
    priority: 'medium',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  }
];

const NutritionInsights: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return '⚡';
      case 'deficiency': return '📊';
      case 'timing': return '⏰';
      case 'interaction': return '🔗';
      default: return '💡';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">AI Nutrition Insights</h3>
          <p className="text-gray-300">Personalized optimization recommendations</p>
        </div>
        
        <motion.button 
          className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-5 h-5 text-emerald-400" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${insight.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <insight.icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(insight.type)}</span>
                    <h4 className="font-semibold text-white truncate">{insight.title}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{insight.description}</p>

                {insight.action && (
                  <motion.button 
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium group-hover:translate-x-1 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>{insight.action}</span>
                    <ChevronRight className="w-3 h-3" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insight Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-white font-semibold">Weekly Nutrition Summary</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your nutrition protocol has improved by 8% this week. Focus on omega-3 optimization 
            and meal timing adjustments to maximize nutrient absorption and metabolic efficiency.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white font-medium transition-all flex items-center justify-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>Generate New Insights</span>
        </button>
      </div>
    </div>
  );
};

export default NutritionInsights;