import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader, CheckCircle, AlertCircle, Clock, Target, Flame, Moon, Apple, Pill } from 'lucide-react';
import { Habit } from '../../types/habit';
import ReactDOM from 'react-dom'; // Import ReactDOM

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habitData: Omit<Habit, 'id' | 'userId' | 'completed' | 'streak' | 'lastCompleted' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const habitIcons = [
  { value: 'Clock', label: 'Meditation', icon: Clock },
  { value: 'Target', label: 'Water', icon: Target },
  { value: 'Flame', label: 'Exercise', icon: Flame },
  { value: 'Moon', label: 'Sleep', icon: Moon },
  { value: 'Pill', label: 'Supplements', icon: Pill },
  { value: 'Apple', label: 'Nutrition', icon: Apple },
  { value: 'Dumbbell', label: 'Strength', icon: Flame }, // Reusing Flame for strength
  { value: 'Heart', label: 'Cardio', icon: Target }, // Reusing Target for cardio
];

const habitColors = [
  { value: 'from-purple-500 to-pink-500', label: 'Purple/Pink' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue/Cyan' },
  { value: 'from-red-500 to-orange-500', label: 'Red/Orange' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo/Purple' },
  { value: 'from-emerald-500 to-teal-500', label: 'Emerald/Teal' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow/Orange' },
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAddHabit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Clock',
    target: '',
    color: 'from-purple-500 to-pink-500',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.target.trim()) {
      setFormError('Habit name and target are required.');
      return;
    }
    try {
      await onAddHabit(formData);
      setFormData({ name: '', icon: 'Clock', target: '', color: 'from-purple-500 to-pink-500' }); // Reset form
      onClose();
    } catch (err) {
      // Error handled by parent component's useHabits hook
    }
  };

  // Render the modal using a Portal
  if (!isOpen) return null; // Don't render anything if not open

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add New Habit</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(error || formError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error || formError}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-white font-semibold">Habit Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Morning Meditation"
              maxLength={25} // Limit to approx. 2-3 words
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
            <p className="text-gray-400 text-xs mt-1">Keep it concise (2-3 words recommended)</p>
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold">Target/Goal</label>
            <input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleInputChange}
              placeholder="e.g., 10 min, 2L, Daily"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold">Icon</label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              {habitIcons.map(item => (
                <option key={item.value} value={item.value} className="bg-gray-800">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-white font-semibold">Color Theme</label>
            <select
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              {habitColors.map(item => (
                <option key={item.value} value={item.value} className="bg-gray-800">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Habit</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>,
    document.getElementById('modal-root')! // Target the new modal root
  );
};

export default AddHabitModal;
