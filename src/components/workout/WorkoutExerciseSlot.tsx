import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Dumbbell, Clock, Zap } from 'lucide-react';
import { Exercise } from '../../types/workout';

interface WorkoutExerciseSlotProps {
  exercise: Exercise | null;
  onPickExercise: () => void;
  onRemoveExercise: () => void;
  onEditExercise: () => void;
}

const WorkoutExerciseSlot: React.FC<WorkoutExerciseSlotProps> = ({
  exercise,
  onPickExercise,
  onRemoveExercise,
  onEditExercise,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex items-center justify-between group"
    >
      {exercise && exercise.name ? (
        <>
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white">{exercise.name}</h4>
              <p className="text-gray-300 text-sm">
                {exercise.sets} sets x {exercise.reps} | Rest: {exercise.rest}
              </p>
              {exercise.notes && (
                <p className="text-gray-400 text-xs mt-1 italic truncate">{exercise.notes}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              onClick={onEditExercise}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit Exercise"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={onRemoveExercise}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Remove Exercise"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </>
      ) : (
        <button
          onClick={onPickExercise}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Pick an Exercise</span>
        </button>
      )}
    </motion.div>
  );
};

export default WorkoutExerciseSlot;