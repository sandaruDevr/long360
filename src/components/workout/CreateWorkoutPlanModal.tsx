import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, Loader, Sparkles, Dumbbell, Clock, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { WorkoutPlan, Exercise } from '../../types/workout';
import WorkoutExerciseSlot from './WorkoutExerciseSlot';
import ExercisePickerModal from './ExercisePickerModal';
import { v4 as uuidv4 } from 'uuid';

interface CreateWorkoutPlanModalProps {
  onClose: () => void;
}

const goals = [
  { value: 'strength', label: 'Strength', icon: '💪' },
  { value: 'muscle', label: 'Muscle', icon: '🏋️' },
  { value: 'endurance', label: 'Endurance', icon: '🏃' },
  { value: 'fat-loss', label: 'Fat Loss', icon: '🔥' },
  { value: 'general', label: 'General', icon: '⚡' }
];

const difficulties = ['beginner', 'intermediate', 'advanced'];

const CreateWorkoutPlanModal: React.FC<CreateWorkoutPlanModalProps> = ({ onClose }) => {
  const { addPlan, isGenerating } = useWorkout();
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(45);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [currentExerciseSlotIndex, setCurrentExerciseSlotIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddExerciseSlot = () => {
    // Add a placeholder exercise to trigger the picker
    setExercises(prev => [...prev, {
      id: uuidv4(), // Temporary ID for the slot
      name: '',
      sets: 0,
      reps: '',
      rest: '',
      muscleGroups: [],
      equipment: [],
      instructions: '',
      tips: '',
      category: '',
      difficulty: 'beginner',
      image: '',
      rating: 0,
      duration: '',
      calories: 0
    }]);
    setCurrentExerciseSlotIndex(exercises.length); // Index of the newly added slot
    setShowExercisePicker(true);
  };

  const handleSelectExercise = (selectedExercise: Exercise) => {
    if (currentExerciseSlotIndex !== null) {
      setExercises(prev => {
        const newExercises = [...prev];
        // Fill the placeholder slot with the selected exercise data
        newExercises[currentExerciseSlotIndex] = {
          ...selectedExercise,
          id: uuidv4(), // Assign a new unique ID for this instance in the plan
          sets: selectedExercise.sets || 3, // Default sets if not provided by library
          reps: selectedExercise.reps || '8-12', // Default reps
          rest: selectedExercise.rest || '60-90 sec' // Default rest
        };
        return newExercises;
      });
    } else {
      // This case should ideally not happen if flow is always through a slot
      setExercises(prev => [...prev, {
        ...selectedExercise,
        id: uuidv4(),
        sets: selectedExercise.sets || 3,
        reps: selectedExercise.reps || '8-12',
        rest: selectedExercise.rest || '60-90 sec'
      }]);
    }
    setShowExercisePicker(false);
    setCurrentExerciseSlotIndex(null);
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setExercises(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleEditExercise = (indexToEdit: number) => {
    setCurrentExerciseSlotIndex(indexToEdit);
    setShowExercisePicker(true);
  };

  const handleSavePlan = async () => {
    if (!planName.trim() || exercises.length === 0) {
      setSaveError('Plan name and at least one exercise are required.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const newPlan: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        name: planName,
        description: description || 'A custom workout plan.',
        duration: duration,
        difficulty: difficulty,
        focusAreas: focusAreas,
        exercises: exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          notes: ex.notes,
          muscleGroups: ex.muscleGroups,
          equipment: ex.equipment,
          instructions: ex.instructions,
          tips: ex.tips,
          category: ex.category,
          difficulty: ex.difficulty,
          image: ex.image,
          rating: ex.rating,
          duration: ex.duration,
          calories: ex.calories
        })),
        estimatedCalories: 0, // This could be calculated based on exercises if needed
        isActive: true,
      };
      await addPlan(newPlan);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save workout plan:', error);
      setSaveError('Failed to save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold text-white">Create New Workout Plan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center space-x-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-300 text-sm">Workout plan saved successfully!</p>
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{saveError}</p>
          </motion.div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-white font-semibold">Plan Name</label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g., Full Body Strength"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the plan"
                rows={1}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-semibold">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="45"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white font-semibold">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                {difficulties.map(d => (
                  <option key={d} value={d} className="bg-gray-800 capitalize">{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-white font-semibold">Focus Areas</label>
              <div className="flex flex-wrap gap-2">
                {goals.map(goal => (
                  <motion.button
                    key={goal.value}
                    type="button"
                    onClick={() => setFocusAreas(prev =>
                      prev.includes(goal.label) ? prev.filter(f => f !== goal.label) : [...prev, goal.label]
                    )}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      focusAreas.includes(goal.label)
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {goal.icon} {goal.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <h4 className="text-lg font-bold text-white mb-4">Exercises</h4>
          <div className="space-y-4">
            <AnimatePresence>
              {exercises.map((exercise, index) => (
                <WorkoutExerciseSlot
                  key={exercise.id || `new-slot-${index}`} // Use exercise.id if available, otherwise a temporary key
                  exercise={exercise.name ? exercise : null} // Pass null if it's a placeholder
                  onPickExercise={() => {
                    setCurrentExerciseSlotIndex(index);
                    setShowExercisePicker(true);
                  }}
                  onRemoveExercise={() => handleRemoveExercise(index)}
                  onEditExercise={() => handleEditExercise(index)}
                />
              ))}
            </AnimatePresence>
            <motion.button
              onClick={handleAddExerciseSlot}
              className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Exercise Slot</span>
            </motion.button>
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end space-x-4 mt-6">
          <motion.button
            onClick={onClose}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSavePlan}
            disabled={isSaving || !planName.trim() || exercises.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            whileHover={{ scale: (isSaving || !planName.trim() || exercises.length === 0) ? 1 : 1.02 }}
            whileTap={{ scale: (isSaving || !planName.trim() || exercises.length === 0) ? 1 : 0.98 }}
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Saving Plan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Plan</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showExercisePicker && (
          <ExercisePickerModal
            onSelectExercise={handleSelectExercise}
            onClose={() => setShowExercisePicker(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreateWorkoutPlanModal;