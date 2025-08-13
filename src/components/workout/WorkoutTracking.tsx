import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  Clock,
  Zap
} from 'lucide-react';
import WorkoutProgressChart from './WorkoutProgressChart';
import WorkoutCalendar from './WorkoutCalendar';
import WorkoutStats from './WorkoutStats';
import WorkoutAchievements from './WorkoutAchievements';
import RecentWorkouts from './RecentWorkouts';
import { useWorkout } from '../../hooks/useWorkout';

type TrackingView = 'overview' | 'progress' | 'calendar' | 'achievements';

interface TrackingTab {
  id: TrackingView;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const trackingTabs: TrackingTab[] = [
  {
    id: 'progress',
    label: 'Progress Charts',
    icon: TrendingUp,
    description: 'Detailed progress analytics'
  },
  {
    id: 'calendar',
    label: 'Workout Calendar',
    icon: Calendar,
    description: 'Schedule and history view'
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: Award,
    description: 'Milestones and badges'
  }
];

const WorkoutTracking: React.FC = () => {
  const [activeView, setActiveView] = useState<TrackingView>('progress');
  const { loading } = useWorkout();

  const renderContent = () => {
    switch (activeView) {
      case 'progress':
        return <WorkoutProgressChart detailed={true} />;
      case 'calendar':
        return <WorkoutCalendar />;
      case 'achievements':
        return <WorkoutAchievements />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-white/10 rounded-2xl"></div>
          <div className="h-48 bg-white/10 rounded-2xl"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Tracking Navigation */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2">
          {trackingTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-5 h-5" />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
                <div className="text-left sm:hidden">
                  <div className="font-semibold text-sm">{tab.label}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default WorkoutTracking;