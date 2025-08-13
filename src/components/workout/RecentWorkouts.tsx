import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp, Play, MoreVertical } from 'lucide-react';

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: string;
  calories: number;
  exercises: number;
  performance: number;
  type: string;
}

const recentWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Upper Body Strength',
    date: '2024-12-13',
    duration: '52 min',
    calories: 380,
    exercises: 8,
    performance: 94,
    type: 'Strength'
  },
  {
    id: '2',
    name: 'HIIT Cardio',
    date: '2024-12-12',
    duration: '28 min',
    calories: 420,
    exercises: 6,
    performance: 88,
    type: 'Cardio'
  },
  {
    id: '3',
    name: 'Lower Body Power',
    date: '2024-12-10',
    duration: '45 min',
    calories: 350,
    exercises: 7,
    performance: 91,
    type: 'Strength'
  },
  {
    id: '4',
    name: 'Core & Mobility',
    date: '2024-12-08',
    duration: '30 min',
    calories: 180,
    exercises: 12,
    performance: 96,
    type: 'Recovery'
  },
  {
    id: '5',
    name: 'Full Body Circuit',
    date: '2024-12-06',
    duration: '40 min',
    calories: 320,
    exercises: 10,
    performance: 89,
    type: 'Circuit'
  }
];

const RecentWorkouts: React.FC = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Strength': return 'from-orange-500 to-red-500';
      case 'Cardio': return 'from-blue-500 to-cyan-500';
      case 'Recovery': return 'from-emerald-500 to-teal-500';
      case 'Circuit': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-emerald-400 bg-emerald-500/20';
    if (performance >= 80) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Recent Workouts</h3>
          <p className="text-gray-300">Your latest training sessions</p>
        </div>
        
        <motion.button 
          className="text-orange-400 hover:text-orange-300 text-sm font-medium"
          whileHover={{ scale: 1.05 }}
        >
          View All
        </motion.button>
      </div>

      <div className="space-y-3">
        {recentWorkouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(workout.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Play className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white truncate">{workout.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(workout.performance)}`}>
                      {workout.performance}%
                    </span>
                    <motion.button 
                      className="p-1 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>{workout.calories} cal</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{workout.exercises} exercises</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400 text-xs">
                    {new Date(workout.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-gray-400 text-xs bg-white/10 px-2 py-1 rounded-full">
                    {workout.type}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-orange-400">
              {Math.round(recentWorkouts.reduce((sum, w) => sum + parseInt(w.duration), 0) / recentWorkouts.length)}
            </div>
            <div className="text-xs text-gray-400">Avg Duration (min)</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              {Math.round(recentWorkouts.reduce((sum, w) => sum + w.calories, 0) / recentWorkouts.length)}
            </div>
            <div className="text-xs text-gray-400">Avg Calories</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">
              {Math.round(recentWorkouts.reduce((sum, w) => sum + w.performance, 0) / recentWorkouts.length)}%
            </div>
            <div className="text-xs text-gray-400">Avg Performance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentWorkouts;