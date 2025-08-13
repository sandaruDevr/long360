import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, TrendingUp, Zap, Apple, Shield, Calendar, X } from 'lucide-react';
import { useNutrition } from '../../hooks/useNutrition';
import { NutritionGoal } from '../../services/nutritionService';

const NutritionGoals: React.FC = () => {
  const { goals, currentEntry, addGoal, updateGoal, loading } = useNutrition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'calories' as NutritionGoal['type'],
    name: '',
    target: 0,
    unit: 'kcal',
    deadline: '',
    priority: 'medium' as NutritionGoal['priority']
  });

  const goalTypes = [
    { value: 'calories', label: 'Calories', unit: 'kcal', icon: Zap },
    { value: 'protein', label: 'Protein', unit: 'g', icon: Apple },
    { value: 'carbs', label: 'Carbohydrates', unit: 'g', icon: Apple },
    { value: 'fats', label: 'Fats', unit: 'g', icon: Apple },
    { value: 'fiber', label: 'Fiber', unit: 'g', icon: Shield },
    { value: 'water', label: 'Water', unit: 'L', icon: Target },
  ];

  const getCurrentValue = (goal: NutritionGoal): number => {
    if (!currentEntry) return 0;
    
    switch (goal.type) {
      case 'calories':
        return currentEntry.dailyTotals.calories;
      case 'protein':
        return currentEntry.dailyTotals.protein;
      case 'carbs':
        return currentEntry.dailyTotals.carbs;
      case 'fats':
        return currentEntry.dailyTotals.fats;
      case 'fiber':
        return currentEntry.dailyTotals.fiber;
      case 'water':
        return currentEntry.hydration.waterIntake;
      default:
        return 0;
    }
  };

  const getProgress = (goal: NutritionGoal): number => {
    const current = getCurrentValue(goal);
    return Math.min((current / goal.target) * 100, 100);
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 90) return 'text-emerald-400 bg-emerald-500/20';
    if (progress >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getStatusText = (progress: number) => {
    if (progress >= 90) return 'Achieved';
    if (progress >= 70) return 'On Track';
    return 'Behind';
  };

  const handleAddGoal = async () => {
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.deadline) return;

    try {
      await addGoal({
        ...newGoal,
        isActive: true
      });
      
      setNewGoal({
        type: 'calories',
        name: '',
        target: 0,
        unit: 'kcal',
        deadline: '',
        priority: 'medium'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleToggleGoal = async (goalId: string, isActive: boolean) => {
    try {
      await updateGoal(goalId, { isActive: !isActive });
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
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

  const activeGoals = goals.filter(g => g.isActive);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Custom Nutrient Goals</h3>
          <p className="text-gray-300">Track your dietary objectives</p>
        </div>
        
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 text-emerald-400" />
        </motion.button>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{activeGoals.length}</div>
          <div className="text-gray-400 text-sm">Active Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {activeGoals.length > 0 
              ? Math.round(activeGoals.reduce((sum, goal) => sum + getProgress(goal), 0) / activeGoals.length)
              : 0
            }%
          </div>
          <div className="text-gray-400 text-sm">Avg Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {activeGoals.filter(g => getProgress(g) >= 90).length}
          </div>
          <div className="text-gray-400 text-sm">Achieved</div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {activeGoals.length > 0 ? (
          activeGoals.map((goal, index) => {
            const currentValue = getCurrentValue(goal);
            const progress = getProgress(goal);
            const goalType = goalTypes.find(t => t.value === goal.type);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    {goalType && <goalType.icon className="w-6 h-6 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{goal.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progress)}`}>
                          {getStatusText(progress)}
                        </span>
                        <button
                          onClick={() => handleToggleGoal(goal.id, goal.isActive)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-300">
                        <span className="text-white font-medium">{Math.round(currentValue * 10) / 10}{goal.unit}</span> / {goal.target}{goal.unit}
                      </div>
                      <div className="text-sm text-gray-400">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-white font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {goal.priority} priority
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>Daily target</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">No Active Goals</h4>
            <p className="text-gray-400 mb-4">Set nutrition goals to track your progress</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Add New Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">Add New Goal</h4>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Goal Type */}
              <div className="space-y-2">
                <label className="text-white font-medium">Goal Type</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => {
                    const selectedType = goalTypes.find(t => t.value === e.target.value);
                    setNewGoal(prev => ({
                      ...prev,
                      type: e.target.value as NutritionGoal['type'],
                      unit: selectedType?.unit || 'g',
                      name: selectedType?.label || ''
                    }));
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white font-medium">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Daily Protein Target"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Target Value</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                      placeholder="150"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-300 text-sm">
                      {newGoal.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white font-medium">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as NutritionGoal['priority'] }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="low" className="bg-gray-800">Low</option>
                    <option value="medium" className="bg-gray-800">Medium</option>
                    <option value="high" className="bg-gray-800">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleAddGoal}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Goal
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionGoals;