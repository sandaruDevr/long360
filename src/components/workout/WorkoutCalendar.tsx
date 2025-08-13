import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Zap, Play, Edit3, Trash2 } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const WorkoutCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { workoutSessions, workoutPlans, logSession, startQuickWorkout, loading } = useWorkout();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getWorkoutsForDate = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workoutSessions.filter(session => session.date === dateString);
  };

  const getSessionTypeColor = (session: any) => {
    if (!session.completed) return 'bg-gray-500';
    
    const planName = session.planName?.toLowerCase() || '';
    if (planName.includes('strength') || planName.includes('power')) return 'bg-orange-500';
    if (planName.includes('cardio') || planName.includes('hiit')) return 'bg-blue-500';
    if (planName.includes('recovery') || planName.includes('mobility')) return 'bg-emerald-500';
    return 'bg-purple-500';
  };

  const handleQuickWorkout = async (date: string) => {
    try {
      await startQuickWorkout(undefined, 'Quick Workout');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error starting quick workout:', error);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateWorkouts = selectedDate ? workoutSessions.filter(session => session.date === selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Workout Calendar</h3>
            <p className="text-gray-300">Schedule and track your training sessions</p>
          </div>
          
          <motion.button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl px-4 py-2 text-orange-400 font-medium transition-all flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Workout</span>
          </motion.button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <h4 className="text-2xl font-bold text-white">{monthName}</h4>

          <motion.button
            onClick={() => navigateMonth('next')}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="text-center text-gray-400 text-sm font-semibold py-2">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-20"></div>;
            }

            const workouts = getWorkoutsForDate(day);
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateString === new Date().toISOString().split('T')[0];
            const isSelected = selectedDate === dateString;

            return (
              <motion.div
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateString)}
                className={`h-20 p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-orange-500/50 bg-orange-500/20' 
                    : isToday 
                    ? 'border-blue-500/50 bg-blue-500/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`text-sm font-semibold mb-1 ${
                  isToday ? 'text-blue-400' : isSelected ? 'text-orange-400' : 'text-white'
                }`}>
                  {day}
                </div>
                
                <div className="space-y-1">
                  {workouts.slice(0, 2).map((session, sessionIndex) => (
                    <div
                      key={session.id}
                      className={`w-full h-1.5 rounded-full ${getSessionTypeColor(session)} ${
                        session.completed ? 'opacity-100' : 'opacity-50'
                      }`}
                    />
                  ))}
                  {workouts.length > 2 && (
                    <div className="text-xs text-gray-400">+{workouts.length - 2}</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && selectedDateWorkouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4">
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>

          <div className="space-y-3">
            {selectedDateWorkouts.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border group ${
                  session.completed ? 'border-emerald-500/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSessionTypeColor(session)}`}></div>
                    <div>
                      <h5 className="font-semibold text-white">{session.planName || 'Workout Session'}</h5>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        {session.durationMinutes > 0 && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.durationMinutes} min</span>
                          </div>
                        )}
                        {session.caloriesBurned > 0 && (
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{session.caloriesBurned} cal</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {session.completed ? (
                      <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          className="p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add Workout</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <motion.button
                onClick={() => handleQuickWorkout(selectedDate || format(new Date(), 'yyyy-MM-dd'))}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Quick Workout
              </motion.button>

              <div className="text-center text-gray-400 text-sm">or choose from your plans</div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {workoutPlans.filter(p => p.isActive).map((plan) => (
                  <motion.button
                    key={plan.id}
                    onClick={() => {
                      startQuickWorkout(plan.id, plan.name);
                      setShowAddModal(false);
                    }}
                    className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 text-white transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-400">{plan.duration} min • {plan.exercises.length} exercises</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Calendar Legend */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h4 className="text-lg font-bold text-white mb-4">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Strength Training</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Cardio</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Recovery</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-500 rounded-full opacity-50"></div>
            <span className="text-gray-300 text-sm">Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCalendar;