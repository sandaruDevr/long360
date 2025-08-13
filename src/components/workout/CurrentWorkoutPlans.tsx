import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Target, 
  Calendar, 
  TrendingUp, 
  Star,
  ChevronRight,
  Edit3,
  MoreVertical,
  Zap,
  Trash2,
  Copy
} from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { useNavigate } from 'react-router-dom';
import CreateWorkoutPlanModal from './CreateWorkoutPlanModal';
 
interface CurrentWorkoutPlansProps {
  onCreateFirstPlan?: () => void;
}

const CurrentWorkoutPlans: React.FC<CurrentWorkoutPlansProps> = ({ onCreateFirstPlan }) => {
  const { workoutPlans, workoutSessions, removePlan, logSession, loading } = useWorkout();
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/20 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-white/5 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const activePlans = workoutPlans.filter(plan => plan.isActive);
  const averageCompletion = activePlans.length > 0 
    ? Math.round(activePlans.reduce((sum, plan) => sum + (plan.completionCount || 0), 0) / activePlans.length)
    : 0;

  const handleStartWorkout = (plan: any) => {
    navigate('/workout-session', { state: { workoutPlan: plan } });
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await removePlan(planId);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const getLastCompletedText = (plan: any) => {
    if (!plan.lastCompleted) return 'Never completed';
    const lastDate = new Date(plan.lastCompleted);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Completed today';
    if (diffDays === 1) return 'Completed yesterday';
    return `Completed ${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Your Active Workout Plans</h3>
            <p className="text-gray-300">Personalized routines based on your fitness goals and genetic profile</p>
          </div>
          
          <motion.button
            onClick={() => setShowCreatePlanModal(true)}
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl px-4 py-2 text-orange-400 font-medium transition-all flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create New Plan
          </motion.button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">{activePlans.length}</div>
            <div className="text-gray-400 text-sm">Active Plans</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">{averageCompletion}%</div>
            <div className="text-gray-400 text-sm">Avg Completion</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {Math.round(activePlans.reduce((sum, plan) => sum + parseInt(plan.duration), 0) / activePlans.length)}
            </div>
            <div className="text-gray-400 text-sm">Avg Duration (min)</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {Math.round(activePlans.reduce((sum, plan) => sum + plan.estimatedCalories, 0) / activePlans.length)}
            </div>
            <div className="text-gray-400 text-sm">Avg Calories</div>
          </div>
        </div>
      </div>

      {/* Workout Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activePlans.length > 0 ? (
          activePlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all group"
            >
              {/* Plan Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-600/20">
                <img
                  src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
                  alt={plan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </span>
                </div>

                {/* Action Button */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-2">
                    <motion.button 
                      onClick={() => handleStartWorkout(plan)}
                      className="p-2 bg-emerald-500/80 backdrop-blur-sm rounded-lg border border-emerald-400/50 hover:bg-emerald-500/90 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button 
                      onClick={() => setPlanToDelete(plan.id)}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MoreVertical className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleStartWorkout(plan)}
                >
                  <motion.button
                    className="w-16 h-16 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-400/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.button>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    {plan.name}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-medium">4.9</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{plan.description}</p>

                {/* Plan Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{plan.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{plan.exercises.length} exercises</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{plan.estimatedCalories} cal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{plan.completionCount || 0}x completed</span>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.focusAreas.map((area, areaIndex) => (
                    <span
                      key={areaIndex}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                {/* Schedule Info */}
                {plan.lastCompleted && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-medium">Last Session</span>
                      </div>
                      <span className="text-blue-400 text-sm">
                        {getLastCompletedText(plan)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => handleStartWorkout(plan)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Workout</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setPlanToDelete(plan.id)}
                    className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">No Active Workout Plans</h4>
            <p className="text-gray-400 mb-6">Create your first AI-generated workout plan to get started</p>
            <motion.button
              onClick={onCreateFirstPlan}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your First Plan
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreatePlanModal && (
          <CreateWorkoutPlanModal 
            key="create-plan-modal"
            onClose={() => setShowCreatePlanModal(false)}
          />
        )}
      </AnimatePresence>


      {/* Quick Actions */}
      

      {/* Delete Confirmation Modal */}
      {planToDelete && (
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
              <h3 className="text-xl font-bold text-white mb-2">Delete Workout Plan</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this workout plan? This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => setPlanToDelete(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleDeletePlan(planToDelete)}
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

export default CurrentWorkoutPlans;