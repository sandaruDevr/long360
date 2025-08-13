import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Clock, FileText, Pill, X, Loader } from 'lucide-react';
import { useSupplement } from '../../hooks/useSupplement';
import { Supplement } from '../../types/supplement';

const AddSupplementForm: React.FC = () => {
  const { addSupplement } = useSupplement();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Supplement, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'adherence' | 'lastTaken' | 'status'>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: [],
    notes: '',
    startDate: new Date().toISOString().split('T')[0],
    category: 'vitamin',
    cost: undefined
  });

  const categories = [
    { value: 'vitamin', label: 'Vitamin', color: 'from-yellow-500 to-orange-500' },
    { value: 'mineral', label: 'Mineral', color: 'from-gray-500 to-slate-600' },
    { value: 'herb', label: 'Herbal', color: 'from-green-500 to-emerald-500' },
    { value: 'protein', label: 'Protein', color: 'from-blue-500 to-cyan-500' },
    { value: 'omega', label: 'Omega-3', color: 'from-teal-500 to-cyan-500' },
    { value: 'probiotic', label: 'Probiotic', color: 'from-purple-500 to-pink-500' },
    { value: 'nootropic', label: 'Nootropic', color: 'from-indigo-500 to-purple-500' },
    { value: 'other', label: 'Other', color: 'from-gray-400 to-gray-600' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'three-times', label: '3x Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as-needed', label: 'As Needed' }
  ];

  const timesOfDay = [
    { value: 'morning', label: 'Morning', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
    { value: 'evening', label: 'Evening', icon: '🌆' },
    { value: 'night', label: 'Night', icon: '🌙' },
    { value: 'with-meals', label: 'With Meals', icon: '🍽️' },
    { value: 'empty-stomach', label: 'Empty Stomach', icon: '⏰' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dosage.trim()) return;

    const submitSupplement = async () => {
      setIsSubmitting(true);
      try {
        await addSupplement(formData);
        
        // Reset form
        setFormData({
          name: '',
          dosage: '',
          frequency: 'daily',
          timeOfDay: [],
          notes: '',
          startDate: new Date().toISOString().split('T')[0],
          category: 'vitamin',
          cost: undefined
        });
        setIsFormOpen(false);
      } catch (error) {
        console.error('Error adding supplement:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    submitSupplement();
  };

  const toggleTimeOfDay = (time: string) => {
    setFormData(prev => ({
      ...prev,
      timeOfDay: prev.timeOfDay.includes(time)
        ? prev.timeOfDay.filter(t => t !== time)
        : [...prev.timeOfDay, time]
    }));
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Add New Supplement</h3>
          <p className="text-gray-300">Track your supplementation protocol</p>
        </div>
        
        <motion.button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`p-3 rounded-xl border transition-all ${
            isFormOpen 
              ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30' 
              : 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFormOpen ? (
            <X className="w-5 h-5 text-red-400" />
          ) : (
            <Plus className="w-5 h-5 text-purple-400" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Supplement Name and Search */}
            <div className="space-y-2">
              <label className="text-white font-semibold">Supplement Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Search or enter supplement name..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-white font-semibold">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-3 rounded-xl border transition-all ${
                      formData.category === category.value
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                      <Pill className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{category.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dosage and Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white font-semibold">Dosage</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 1000mg, 2 capsules"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white font-semibold">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value} className="bg-gray-800">
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time of Day */}
            <div className="space-y-3">
              <label className="text-white font-semibold">Time of Day</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timesOfDay.map((time) => (
                  <motion.button
                    key={time.value}
                    type="button"
                    onClick={() => toggleTimeOfDay(time.value)}
                    className={`p-3 rounded-xl border transition-all ${
                      formData.timeOfDay.includes(time.value)
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{time.icon}</div>
                      <span className="text-white text-sm font-medium">{time.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Start Date and Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white font-semibold">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-white font-semibold">Monthly Cost (Optional)</label>
                <input
                  type="number"
                  value={formData.cost || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="$0.00"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-white font-semibold">Notes (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Purpose, side effects, interactions, etc."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.dosage.trim()}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Supplement</span>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Quick Add Suggestions */}
      {!isFormOpen && (
        <div className="space-y-4">
          <h4 className="text-white font-semibold">Popular Supplements</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Vitamin D3', 'Omega-3', 'Magnesium', 'Vitamin B12'].map((supplement) => (
              <motion.button
                key={supplement}
                onClick={() => {
                  setFormData(prev => ({ ...prev, name: supplement }));
                  setIsFormOpen(true);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white text-sm font-medium transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                + {supplement}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSupplementForm;