import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, TrendingUp, Clock, Brain, Zap, Calendar, Flame, Award, BarChart3, ChevronDown, ChevronUp, Moon } from 'lucide-react';
import { SleepGoal, SleepEntry } from '../../types/sleep';

interface SleepGoalsProps {
  sleepGoals: SleepGoal[];
  sleepEntries: SleepEntry[];
  addSleepGoal: (goalData: Omit<SleepGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSleepGoal: (goalId: string, updates: Partial<SleepGoal>) => Promise<void>;
  removeSleepGoal: (goalId: string) => Promise<void>;
  loading: boolean;
}

const goalTypes = [
  { value: 'duration', label: 'Sleep Duration', icon: Clock, unit: 'hours' },
  { value: 'quality', label: 'Sleep Quality', icon: Brain, unit: 'score' },
  { value: 'efficiency', label: 'Sleep Efficiency', icon: Zap },
  { value: 'consistency', label: 'Sleep Consistency', icon: Target, unit: 'days' },
  { value: 'bedtime', label: 'Bedtime Consistency', icon: Moon, unit: 'time' }
];

const SleepGoals: React.FC<SleepGoalsProps> = ({ 
  sleepGoals, 
  sleepEntries, 
  addSleepGoal, 
  updateSleepGoal, 
  removeSleepGoal, 
  loading 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string>('');
  const [newGoal, setNewGoal] = useState({
    type: 'duration' as SleepGoal['type'],
    name: '',
    target: 8,
    unit: 'hours',
    deadline: '',
    priority: 'medium' as SleepGoal['priority'],
    targetBedtime: '',
    targetWakeTime: ''
  });

  const getCurrentValue = (goal: SleepGoal): number => {
    if (sleepEntries.length === 0) return 0;
    
    switch (goal.type) {
      case 'duration':
        return sleepEntries.slice(0, 7).reduce((sum, entry) => sum + entry.totalSleep, 0) / Math.min(7, sleepEntries.length);
      case 'quality':
        return sleepEntries.slice(0, 7).reduce((sum, entry) => sum + entry.sleepScore, 0) / Math.min(7, sleepEntries.length);
      case 'efficiency':
        return sleepEntries.slice(0, 7).reduce((sum, entry) => sum + entry.sleepEfficiency, 0) / Math.min(7, sleepEntries.length);
      case 'consistency':
        return getConsistencyStreak(goal);
      case 'bedtime':
        return getBedtimeConsistency(goal);
      default:
        return 0;
    }
  };

  const getConsistencyStreak = (goal: SleepGoal): number => {
    let streak = 0;
    const sortedEntries = sleepEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const entry of sortedEntries) {
      if (entry.sleepScore >= 80) { // Quality sleep threshold
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getBedtimeConsistency = (goal: SleepGoal): number => {
    if (!goal.targetBedtime || sleepEntries.length === 0) return 0;
    
    const targetTime = new Date(`2024-01-01T${goal.targetBedtime}:00`);
    const consistentDays = sleepEntries.filter(entry => {
      const bedtime = new Date(entry.bedtime);
      const entryTime = new Date(`2024-01-01T${bedtime.getHours()}:${bedtime.getMinutes()}:00`);
      const timeDiff = Math.abs(entryTime.getTime() - targetTime.getTime()) / (1000 * 60); // minutes
      return timeDiff <= 30; // Within 30 minutes
    }).length;
    
    return consistentDays;
  };

  const getProgress = (goal: SleepGoal): number => {
    const current = getCurrentValue(goal);
    return Math.min((current / goal.target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-emerald-400 bg-emerald-500/20';
      case 'on-track': return 'text-blue-400 bg-blue-500/20';
      case 'behind': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'achieved': return 'Achieved';
      case 'on-track': return 'On Track';
      case 'behind': return 'Behind';
      default: return 'Unknown';
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.deadline) return;

    try {
      await addSleepGoal({
        type: newGoal.type,
        name: newGoal.name,
        target: newGoal.target,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        priority: newGoal.priority,
        isActive: true,
        targetBedtime: newGoal.targetBedtime || undefined,
        targetWakeTime: newGoal.targetWakeTime || undefined
      });
      
      setNewGoal({
        type: 'duration',
        name: '',
        target: 8,
        unit: 'hours',
        deadline: '',
        priority: 'medium',
        targetBedtime: '',
        targetWakeTime: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding sleep goal:', error);
    }
  };

  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoal(expandedGoal === goalId ? '' : goalId);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-48 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Sleep Goals & Progress Tracking</h3>
            <p className="text-gray-300">Monitor your sleep objectives with detailed analytics</p>
          </div>
          
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 text-indigo-400" />
          </motion.button>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-1">{sleepGoals.filter(g => g.isActive).length}</div>
            <div className="text-gray-400 text-sm">Active Goals</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {sleepGoals.filter(g => g.isActive).length > 0 
                ? Math.round(sleepGoals.filter(g => g.isActive).reduce((sum, goal) => sum + getProgress(goal), 0) / sleepGoals.filter(g => g.isActive).length)
                : 0}%
            </div>
            <div className="text-gray-400 text-sm">Avg Success</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {sleepGoals.filter(g => g.isActive).length > 0 
                ? Math.max(...sleepGoals.filter(g => g.isActive).map(g => g.currentProgress))
                : 0}
            </div>
            <div className="text-gray-400 text-sm">Best Streak</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {sleepGoals.filter(g => g.isActive && getProgress(g) >= 70).length}
            </div>
            <div className="text-gray-400 text-sm">On Track</div>
          </div>
        </div>

        {/* Add New Goal Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10"
            >
              <h4 className="text-white font-semibold mb-4">Add New Sleep Goal</h4>
              
              <div className="space-y-4">
                {/* Goal Type Selection */}
                <div className="space-y-2">
                  <label className="text-white font-medium">Goal Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        onClick={() => setNewGoal(prev => ({ 
                          ...prev, 
                          type: type.value, 
                          unit: type.unit || 'units',
                          name: type.label 
                        }))}
                        className={`p-3 rounded-xl border transition-all ${
                          newGoal.type === type.value
                            ? 'border-indigo-500/50 bg-indigo-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-2">
                          <type.icon className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">{type.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white font-medium">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter goal title..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-medium">Target Value</label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                      placeholder="8"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Sleep Consistency Specific Fields */}
                {(newGoal.type === 'consistency' || newGoal.type === 'bedtime') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <div className="space-y-2">
                      <label className="text-white font-medium">Target Bedtime</label>
                      <input
                        type="time"
                        value={newGoal.targetBedtime}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetBedtime: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white font-medium">Target Wake Time</label>
                      <input
                        type="time"
                        value={newGoal.targetWakeTime}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, targetWakeTime: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-white font-medium">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button onClick={handleAddGoal} className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium">
                  Add Goal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Goals List with Heatmaps */}
      <div className="space-y-6">
        {sleepGoals.filter(g => g.isActive).map((goal, index) => {
          const progress = getProgress(goal);
          const currentValue = getCurrentValue(goal);
          const status = progress >= 100 ? 'achieved' : progress >= 70 ? 'on-track' : 'behind';
          const goalType = goalTypes.find(t => t.value === goal.type);
          
          return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
          >
            {/* Goal Header */}
            <motion.div 
              className="flex items-start justify-between mb-6 cursor-pointer"
              onClick={() => toggleGoalExpansion(goal.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  {goalType && <goalType.icon className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{goal.name}</h4>
                  <p className="text-gray-300">
                    Target: {goal.target}{goal.unit} • Current: <span className="text-white font-medium">{Math.round(currentValue * 10) / 10}{goal.unit}</span>
                  </p>
                  {(goal.type === 'consistency' || goal.type === 'bedtime') && goal.targetBedtime && goal.targetWakeTime && (
                    <p className="text-indigo-400 text-sm mt-1">
                      Sleep: {goal.targetBedtime} - {goal.targetWakeTime}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(goal.status)}`}>
                  {getStatusText(status)}
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
                  <div className="text-gray-400 text-xs">Progress</div>
                </div>
                <motion.div
                  animate={{ rotate: expandedGoal === goal.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-white/10 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-bold text-lg">{goal.currentProgress}</span>
                </div>
                <div className="text-gray-400 text-xs">Current Streak</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">{goal.target}</span>
                </div>
                <div className="text-gray-400 text-xs">Target</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-lg">{Math.round(progress)}%</span>
                </div>
                <div className="text-gray-400 text-xs">Progress</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-bold text-lg">
                    {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">Deadline</div>
              </div>
            </div>

            {/* Goal Insights */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h5 className="text-white font-semibold">Goal Insight</h5>
              </div>
              <p className="text-gray-300 text-sm">
                {goal.currentProgress > 0 
                  ? `Great progress! You've achieved ${goal.currentProgress} out of ${goal.target} ${goal.unit}. `
                  : 'Focus on consistency to build a strong streak. '
                }
                {progress >= 80 
                  ? 'Your performance is excellent - keep up the great work!'
                  : progress >= 60
                  ? 'Good progress! Small improvements can boost your success rate.'
                  : 'Consider adjusting your approach or target to improve consistency.'
                }
              </p>
            </div>
          </motion.div>
        );
        })}
        
        {sleepGoals.filter(g => g.isActive).length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">No Active Sleep Goals</h4>
            <p className="text-gray-400 mb-4">Set sleep goals to track your progress and build healthy habits</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepGoals;