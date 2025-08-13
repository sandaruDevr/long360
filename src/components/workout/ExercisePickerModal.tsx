import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Dumbbell, Heart, Target, Star, Clock, Zap } from 'lucide-react';
import { exercises as allExercises } from './WorkoutLibrary'; // Import all exercises
import { Exercise } from '../../types/workout';

interface ExercisePickerModalProps {
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

const categories = ['All', 'Strength', 'Cardio', 'Bodyweight', 'Core', 'Flexibility'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];
const equipmentOptions = ['All', 'None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Kettlebells', 'Machines', 'Cable Machine', 'Pull-up Bar', 'Bench', 'Leg Press Machine', 'Dip Bar', 'Jump Rope', 'Box', 'Wall', 'Incline Bench'];

const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({ onSelectExercise, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');

  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
      const matchesEquipment = selectedEquipment === 'All' ||
                              exercise.equipment.includes(selectedEquipment) ||
                              (selectedEquipment === 'None' && exercise.equipment.includes('None'));

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedEquipment]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Strength': return <Dumbbell className="w-4 h-4" />;
      case 'Cardio': return <Heart className="w-4 h-4" />;
      case 'Core': return <Target className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
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
        className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-3xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h3 className="text-xl font-bold text-white">Select an Exercise</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 flex-shrink-0">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises, muscle groups..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">{category}</option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="bg-gray-800 capitalize">{difficulty}</option>
              ))}
            </select>

            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              {equipmentOptions.map(equipment => (
                <option key={equipment} value={equipment} className="bg-gray-800">{equipment}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectExercise(exercise)}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">{exercise.name}</h4>
                      <p className="text-gray-300 text-sm mb-2">{exercise.muscleGroups.join(', ')}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-400">
                          {getCategoryIcon(exercise.category)}
                          <span>{exercise.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                No exercises found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExercisePickerModal;