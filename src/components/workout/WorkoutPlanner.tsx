import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Zap, 
  Clock, 
  Calendar, 
  Play, 
  Star,
  ChevronRight,
  Sparkles,
  Brain,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import CurrentWorkoutPlans from './CurrentWorkoutPlans';
import AIWorkoutGenerator from './AIWorkoutGenerator';
import WorkoutLibrary from './WorkoutLibrary';

type PlannerView = 'current' | 'generator' | 'library';

interface PlannerTab {
  id: PlannerView;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const plannerTabs: PlannerTab[] = [
  {
    id: 'current',
    label: 'Current Plans',
    icon: Target,
    description: 'Your active workout routines'
  },
  {
    id: 'generator',
    label: 'AI Generator',
    icon: Brain,
    description: 'Create personalized workouts'
  },
  {
    id: 'library',
    label: 'Exercise Library',
    icon: Award,
    description: 'Browse exercise database'
  }
];

const WorkoutPlanner: React.FC = () => {
  const [activeView, setActiveView] = useState<PlannerView>('current');

  const renderContent = () => {
    switch (activeView) {
      case 'current':
        return <CurrentWorkoutPlans onCreateFirstPlan={() => setActiveView('generator')} />; // Correctly pass setActiveView
      case 'generator':
        return <AIWorkoutGenerator />;
      case 'library':
        return <WorkoutLibrary />;
      default:
        return <CurrentWorkoutPlans />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Planner Navigation */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-2">
        <div className="grid grid-cols-3 gap-2">
          {plannerTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center justify-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
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
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPlanner;