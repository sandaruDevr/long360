import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SleepStats } from '../../types/sleep';

interface SleepQuickTipsProps {
  sleepStats: SleepStats;
}

const SleepQuickTips: React.FC<SleepQuickTipsProps> = ({ sleepStats }) => {
  const { t } = useTranslation();

  const tips = [
    {
      id: 1,
      title: 'Maintain Consistent Sleep Schedule',
      description: 'Go to bed and wake up at the same time every day, even on weekends.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Create a Relaxing Bedtime Routine',
      description: 'Develop calming activities 30-60 minutes before bedtime.',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Optimize Your Sleep Environment',
      description: 'Keep your bedroom cool, dark, and quiet for better sleep quality.',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Limit Screen Time Before Bed',
      description: 'Avoid electronic devices at least 1 hour before sleep.',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-green-400 bg-green-400/10';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Lightbulb className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Sleep Quick Tips</h3>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tip.priority)}`}>
                    {tip.priority.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">
                  {tip.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors ml-2 flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <p className="text-blue-400 text-sm">
          💡 Based on your sleep patterns, focus on maintaining a consistent bedtime routine for better sleep quality.
        </p>
      </div>
    </div>
  );
};

export default SleepQuickTips;