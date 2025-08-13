import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, AlertCircle, ChevronRight, Bookmark } from 'lucide-react';

interface Insight {
  id: string;
  type: 'recommendation' | 'alert' | 'achievement' | 'tip';
  title: string;
  description: string;
  action?: string; // This will be removed from rendering
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  icon: React.ComponentType<any>;
  color: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Optimize Vitamin D Intake',
    description: 'Your genetic profile suggests increased need for Vitamin D. Consider supplementation.',
    action: 'View Recommendations',
    priority: 'high',
    timestamp: '2 hours ago',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Sleep Quality Improved',
    description: 'Your sleep score increased by 15% this week. Great progress!',
    priority: 'medium',
    timestamp: '5 hours ago',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Stress Levels Elevated',
    description: 'HRV data indicates increased stress. Consider meditation or breathing exercises.',
    action: 'Start Session',
    priority: 'high',
    timestamp: '1 day ago',
    icon: AlertCircle,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: '4',
    type: 'tip',
    title: 'Meal Timing Optimization',
    description: 'Based on your circadian rhythm, eating earlier may improve metabolism.',
    priority: 'low',
    timestamp: '2 days ago',
    icon: Brain,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: '5',
    type: 'recommendation',
    title: 'Increase Fiber Intake',
    description: 'Your nutrition analysis shows low fiber. Add more fruits, vegetables, and whole grains.',
    action: 'Explore Recipes',
    priority: 'medium',
    timestamp: '3 days ago',
    icon: Lightbulb,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '6',
    type: 'achievement',
    title: 'Workout Consistency Streak',
    description: 'You completed 5 consecutive workouts this week! Keep up the great work.',
    priority: 'medium',
    timestamp: '4 days ago',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '7',
    type: 'alert',
    title: 'Hydration Below Target',
    description: 'Your water intake is consistently below your daily goal. Increase fluid consumption.',
    action: 'Log Water',
    priority: 'high',
    timestamp: '5 days ago',
    icon: AlertCircle,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '8',
    type: 'tip',
    title: 'Morning Sunlight Exposure',
    description: 'Get 10-15 minutes of morning sunlight to regulate your circadian rhythm.',
    priority: 'low',
    timestamp: '6 days ago',
    icon: Brain,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '9',
    type: 'recommendation',
    title: 'Review Supplement Protocol',
    description: 'Consider optimizing your supplement timing for better absorption and synergy.',
    action: 'Adjust Protocol',
    priority: 'medium',
    timestamp: '1 week ago',
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '10',
    type: 'achievement',
    title: 'Biological Age Reduction',
    description: 'Your biological age has reduced by 1 year based on recent data. Fantastic!',
    priority: 'high',
    timestamp: '1 week ago',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500'
  }
];

const InsightsFeed: React.FC = () => {
  const [showAllInsights, setShowAllInsights] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const insightsToDisplay = showAllInsights ? insights : insights.slice(0, 4);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">AI Insights</h3>
          <p className="text-gray-300">Personalized recommendations</p>
        </div>
        
        <motion.button 
          className="p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bookmark className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {insightsToDisplay.map((insight, index) => (
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
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white truncate">{insight.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{insight.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">{insight.timestamp}</span>
                  {/* Removed insight.action button */}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() => setShowAllInsights(!showAllInsights)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white font-medium transition-all flex items-center justify-center space-x-2"
        >
          <span>{showAllInsights ? 'Show Less Insights' : 'View All Insights'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InsightsFeed;
