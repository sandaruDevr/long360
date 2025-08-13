import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Clock, 
  Calendar, 
  DollarSign, 
  Edit3, 
  Trash2, 
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Filter,
  Loader
} from 'lucide-react';
import { useSupplement } from '../../hooks/useSupplement';
import { Supplement } from '../../types/supplement';

const SupplementList: React.FC = () => {
  const { 
    supplements, 
    updateSupplementItem, 
    removeSupplement, 
    markSupplementTaken,
    loading 
  } = useSupplement();
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'adherence' | 'cost' | 'startDate'>('name');
  const [editingSupplement, setEditingSupplement] = useState<string | null>(null);
  const [deletingSupplement, setDeletingSupplement] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      vitamin: 'from-yellow-500 to-orange-500',
      mineral: 'from-gray-500 to-slate-600',
      herb: 'from-green-500 to-emerald-500',
      protein: 'from-blue-500 to-cyan-500',
      omega: 'from-teal-500 to-cyan-500',
      probiotic: 'from-purple-500 to-pink-500',
      nootropic: 'from-indigo-500 to-purple-500',
      other: 'from-gray-400 to-gray-600'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-emerald-400 bg-emerald-500/20';
    if (adherence >= 75) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatTimeOfDay = (times: string[]) => {
    if (!times || !Array.isArray(times)) {
      return '';
    }
    const timeMap: { [key: string]: string } = {
      'morning': '🌅',
      'afternoon': '☀️',
      'evening': '🌆',
      'night': '🌙',
      'with-meals': '🍽️',
      'empty-stomach': '⏰'
    };
    return times.map(time => timeMap[time] || time).join(' ');
  };

  const handleDeleteSupplement = async (supplementId: string) => {
    try {
      await removeSupplement(supplementId);
      setDeletingSupplement(null);
    } catch (error) {
      console.error('Error deleting supplement:', error);
    }
  };

  const handleMarkTaken = async (supplementId: string) => {
    try {
      await markSupplementTaken(supplementId, true);
    } catch (error) {
      console.error('Error marking supplement taken:', error);
    }
  };

  const filteredSupplements = supplements
    .filter(supplement => filter === 'all' || supplement.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'adherence':
          return (b.adherence || 0) - (a.adherence || 0);
        case 'cost':
          return (b.cost || 0) - (a.cost || 0);
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeSupplements = supplements.filter(s => s.status === 'active');
  const totalCost = activeSupplements.reduce((sum, s) => sum + (s.cost || 0), 0);
  const averageAdherence = activeSupplements.length > 0
    ? activeSupplements.reduce((sum, s) => sum + (s.adherence || 0), 0) / activeSupplements.length
    : 0;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Your Supplements</h3>
          <p className="text-gray-300">{filteredSupplements.length} supplements • ${Math.round(totalCost)}/month</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter Buttons */}
          <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
            {(['all', 'active', 'paused'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                  filter === filterOption
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="name" className="bg-gray-800">Name</option>
            <option value="adherence" className="bg-gray-800">Adherence</option>
            <option value="cost" className="bg-gray-800">Cost</option>
            <option value="startDate" className="bg-gray-800">Start Date</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{activeSupplements.length}</div>
          <div className="text-gray-400 text-sm">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{Math.round(averageAdherence)}%</div>
          <div className="text-gray-400 text-sm">Avg Adherence</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">${Math.round(totalCost)}</div>
          <div className="text-gray-400 text-sm">Monthly Cost</div>
        </div>
      </div>

      {/* Supplements Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSupplements.length > 0 ? (
            filteredSupplements.map((supplement, index) => (
              <motion.div
                key={supplement.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border transition-all hover:bg-white/10 ${
                  supplement.status === 'active' ? 'border-white/20' : 'border-yellow-500/30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(supplement.category)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Pill className="w-6 h-6 text-white" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{supplement.name}</h4>
                        <p className="text-gray-400 text-sm">{supplement.dosage} • {supplement.frequency}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplement.status)}`}>
                          {supplement.status}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{formatTimeOfDay(supplement.timeOfDay)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          Since {new Date(supplement.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {supplement.cost && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">${supplement.cost}/month</span>
                        </div>
                      )}
                      
                      {supplement.adherence && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getAdherenceColor(supplement.adherence)}`}>
                            {supplement.adherence}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {supplement.notes && (
                      <p className="text-gray-400 text-sm mb-3 italic">{supplement.notes}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={() => setEditingSupplement(supplement.id)}
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => setDeletingSupplement(supplement.id)}
                          className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => handleMarkTaken(supplement.id)}
                          className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Mark Taken</span>
                        </motion.button>
                      </div>

                      {supplement.lastTaken && (
                        <span className="text-gray-400 text-xs">
                          Last taken: {new Date(supplement.lastTaken).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">No supplements found</h4>
              <p className="text-gray-400 mb-4">
                {filter === 'all' 
                  ? "Add your first supplement to start tracking your protocol."
                  : `No ${filter} supplements found. Try adjusting your filter.`
                }
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  View all supplements
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingSupplement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Supplement</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this supplement? This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setDeletingSupplement(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteSupplement(deletingSupplement)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupplementList;