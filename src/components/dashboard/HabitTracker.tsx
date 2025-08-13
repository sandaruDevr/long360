import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Flame, Target, Clock, X, Loader, AlertCircle, Moon, Apple, Pill } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import { Habit } from '../../types/habit';
import AddHabitModal from './AddHabitModal'; // Import the new modal component
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

const HabitTracker: React.FC = () => {
  const { habits, loading, error, addHabit, toggleHabitCompletion, deleteHabitItem } = useHabits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const getLucideIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Target; // Fallback to Target icon
  };

  const handleToggleHabit = async (habit: Habit) => {
    try {
      await toggleHabitCompletion(habit.id, !habit.completed);
    } catch (err) {
      console.error("Failed to toggle habit completion:", err);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setIsDeleting(habitId);
    try {
      await deleteHabitItem(habitId);
    } catch (err) {
      console.error("Failed to delete habit:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const completedCount = habits.filter(h => h.completed && h.isActive).length;
  const activeHabits = habits.filter(h => h.isActive);
  const completionPercentage = activeHabits.length > 0 ? (completedCount / activeHabits.length) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Daily Habits</h3>
          <p className="text-gray-300">Today's progress: {completedCount}/{activeHabits.length}</p>
        </div>
        
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 text-blue-400" />
        </motion.button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Daily Progress</span>
          <span className="text-sm font-semibold text-white">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-2">
        <AnimatePresence>
          {activeHabits.length > 0 ? (
            activeHabits.map((habit) => {
              const IconComponent = getLucideIcon(habit.icon);
              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all ${
                    habit.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <motion.button
                      onClick={() => handleToggleHabit(habit)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        habit.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {habit.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <div className={`w-8 h-8 bg-gradient-to-r ${habit.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${habit.completed ? 'text-white line-through' : 'text-white'}`}>
                          {habit.name}
                        </h4>
                        <span className="text-gray-400 text-sm">{habit.target}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span className="text-xs text-gray-400">{habit.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      disabled={isDeleting === habit.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isDeleting === habit.id ? <Loader className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">No Habits Tracked Yet</h4>
              <p className="text-gray-400 mb-4">Add your first habit to start building healthy routines!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Add New Habit
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AddHabitModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddHabit={addHabit}
        isLoading={loading} // Use loading from useHabits for modal submission state
        error={error} // Pass error to modal
      />
    </div>
  );
};

export default HabitTracker;
