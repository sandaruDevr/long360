import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, TrendingUp, Pill, Shield, Calendar, X, Loader } from 'lucide-react';
import { useSupplement } from '../../hooks/useSupplement';
import { SupplementGoal } from '../../types/supplement';

const SupplementGoals: React.FC = () => {
  const { supplementGoals, addGoal, updateGoal, removeGoal, loading } = useSupplement();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'adherence' as SupplementGoal['type'],
    name: '',
    target: 0,
    unit: '%',
    deadline: '',
    priority: 'medium' as SupplementGoal['priority']
  });

  const goalTypes = [
    { value: 'adherence', label: 'Adherence Rate', unit: '%', icon: Target },
    { value: 'cost', label: 'Monthly Cost', unit: '$', icon: Shield },
    { value: 'biomarker', label: 'Biomarker Level', unit: 'ng/mL', icon: Pill },
    { value: 'custom', label: 'Custom Goal', unit: '', icon: TrendingUp }
  ];

  const handleAddGoal = async () => {
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.deadline) return;

    setIsSubmitting(true);
    try {
      await addGoal({
        ...newGoal,
        isActive: true
      });
      
      setNewGoal({
        type: 'adherence',
        name: '',
        target: 0,
        unit: '%',
        deadline: '',
        priority: 'medium'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await removeGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getProgress = (goal: SupplementGoal): number => {
    return Math.min((goal.currentProgress / goal.target) * 100, 100);
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

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeGoals = supplementGoals.filter(g => g.isActive);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Supplement Goals</h3>
          <p className="text-gray-300">{activeGoals.length} active goals</p>
        </div>
        
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 text-purple-400" />
        </motion.button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {activeGoals.length > 0 ? (
          activeGoals.map((goal, index) => {
            const progress = getProgress(goal);
            const status = progress >= 100 ? 'achieved' : progress >= 70 ? 'on-track' : 'behind';
            
            return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{goal.name}</h4>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-300">
                    <span className="text-white font-medium">{goal.currentProgress}{goal.unit}</span> / {goal.target}{goal.unit}
                  </div>
                  <div className="text-sm text-gray-400">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs text-white font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusText(status)}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-400 text-xs">
                    <TrendingUp className="w-3 h-3" />
                    <span>{goal.priority} priority</span>
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
            <p className="text-gray-400 mb-4">Set supplement goals to track your progress</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-purple-400 hover:text-purple-300 font-medium"
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
            className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
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
            
            <div className="space-y-3">
              {/* Goal Type */}
              <div className="space-y-2">
                <label className="text-white font-medium">Goal Type</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => {
                    const selectedType = goalTypes.find(t => t.value === e.target.value);
                    setNewGoal(prev => ({
                      ...prev,
                      type: e.target.value as SupplementGoal['type'],
                      unit: selectedType?.unit || '',
                      name: selectedType?.label || ''
                    }));
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-gray-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-white font-medium">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Daily Adherence Target"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Target Value</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                      placeholder="90"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <span className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-gray-300 text-sm">
                      {newGoal.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-white font-medium">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as SupplementGoal['priority'] }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low" className="bg-gray-800">Low</option>
                    <option value="medium" className="bg-gray-800">Medium</option>
                    <option value="high" className="bg-gray-800">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleAddGoal}
                disabled={isSubmitting || !newGoal.name.trim() || !newGoal.target || !newGoal.deadline}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Goal</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-purple-400">{activeGoals.length}</div>
            <div className="text-xs text-gray-400">Active Goals</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">
              {activeGoals.length > 0 
                ? Math.round(activeGoals.reduce((sum, goal) => sum + getProgress(goal), 0) / activeGoals.length)
                : 0}%
            </div>
            <div className="text-xs text-gray-400">Avg Progress</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              {activeGoals.filter(g => getProgress(g) >= 70).length}
            </div>
            <div className="text-xs text-gray-400">On Track</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementGoals;