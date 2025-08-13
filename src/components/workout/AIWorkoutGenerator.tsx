import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Clock, 
  Zap, 
  TrendingUp, 
  Sparkles,
  Play, 
  Save,
  RefreshCw,
  Settings,
  User,
  Calendar,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { WorkoutPreferences } from '../../services/openai';

interface WorkoutPreferences {
  goal: string;
  duration: string;
  difficulty: string;
  equipment: string[];
  focus: string[];
  frequency: string;
}

interface GeneratedWorkout {
  id: string;
  name: string;
  description: string;
  duration: string;
  exercises: Exercise[];
  estimatedCalories: number;
  difficulty: string;
  focus: string[];
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  muscleGroups: string[];
}

const AIWorkoutGenerator: React.FC = () => {
  const { generateAIWorkout, isGenerating } = useWorkout();
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    goal: 'strength', // Default goal
    duration: 45, // Default duration
    difficulty: 'intermediate', // Default difficulty
    equipment: [], // Initialize as empty array
    focusAreas: [], // Initialize as empty array
    frequency: '3-4'
  });

  const [generatedPlanId, setGeneratedPlanId] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<WorkoutPlan | null>(null);

  const goals = [
    { value: 'strength', label: 'Build Strength', icon: '💪', color: 'from-red-500 to-orange-500' },
    { value: 'muscle', label: 'Muscle Growth', icon: '🏋️', color: 'from-blue-500 to-cyan-500' },
    { value: 'endurance', label: 'Endurance', icon: '🏃', color: 'from-emerald-500 to-teal-500' },
    { value: 'fat-loss', label: 'Fat Loss', icon: '🔥', color: 'from-yellow-500 to-orange-500' },
    { value: 'general', label: 'General Fitness', icon: '⚡', color: 'from-purple-500 to-pink-500' }
  ];

  const equipment = [
    { value: 'bodyweight', label: 'Bodyweight', icon: '🤸' },
    { value: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { value: 'barbell', label: 'Barbell', icon: '🏋️' },
    { value: 'resistance-bands', label: 'Resistance Bands', icon: '🎯' },
    { value: 'kettlebells', label: 'Kettlebells', icon: '⚫' },
    { value: 'machines', label: 'Gym Machines', icon: '🏢' }
  ];

  const focusAreas = [
    { value: 'upper-body', label: 'Upper Body', icon: '💪' },
    { value: 'lower-body', label: 'Lower Body', icon: '🦵' },
    { value: 'core', label: 'Core', icon: '🎯' },
    { value: 'full-body', label: 'Full Body', icon: '🏃' },
    { value: 'cardio', label: 'Cardio', icon: '❤️' },
    { value: 'flexibility', label: 'Flexibility', icon: '🧘' }
  ];

  const handleGenerateWorkout = async () => {

    try {
      const workoutPlan = await generateAIWorkout(preferences);
      setGeneratedWorkout(workoutPlan);
      setGeneratedPlanId(workoutPlan.id);
      setGenerationSuccess(true);
      
      // Notify parent component that plan was generated
      // onPlanGenerated?.();
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setGenerationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating workout:', error);
    }
  };

  const toggleEquipment = (equipmentItem: string) => {
    setPreferences(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentItem)
        ? prev.equipment.filter(e => e !== equipmentItem)
        : [...prev.equipment, equipmentItem]
    }));
  };

  const toggleFocus = (focusArea: string) => {
    setPreferences(prev => ({ // Corrected function name to toggleFocusArea
      ...prev,
      focusAreas: prev.focusAreas.includes(focusArea)
        ? prev.focusAreas.filter(f => f !== focusArea)
        : [...prev.focusAreas, focusArea]
    }));
  };

  return (
    <div className="space-y-8">
      {/* AI Generator Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Workout Generator</h3>
            <p className="text-gray-300">Create personalized workouts based on your health metrics and goals</p>
          </div>
        </div>

        {/* Health Metrics Integration */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-semibold">AI Insights from Your Profile</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-gray-300">Genetic predisposition: Power athlete</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Recovery rate: Above average</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300">Injury risk: Low (shoulders)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workout Preferences */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white">Workout Preferences</h4>
              <motion.button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </motion.button>
            </div>

            {/* Primary Goal */}
            <div className="space-y-3 mb-6">
              <label className="text-white font-semibold">Primary Goal</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {goals.map((goal) => (
                  <motion.button
                    key={goal.value}
                    onClick={() => setPreferences(prev => ({ ...prev, goal: goal.value }))}
                    className={`p-3 rounded-xl border transition-all ${
                      preferences.goal === goal.value
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{goal.icon}</div>
                      <div className="text-white text-sm font-medium">{goal.label}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Duration and Difficulty */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-white font-semibold">Duration (minutes)</label>
                <select
                  value={preferences.duration}
                  onChange={(e) => setPreferences(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="15" className="bg-gray-800">15 minutes</option>
                  <option value="30" className="bg-gray-800">30 minutes</option>
                  <option value="45" className="bg-gray-800">45 minutes</option>
                  <option value="60" className="bg-gray-800">60 minutes</option>
                  <option value="90" className="bg-gray-800">90 minutes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold">Difficulty Level</label>
                <select
                  value={preferences.difficulty}
                  onChange={(e) => setPreferences(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="beginner" className="bg-gray-800">Beginner</option>
                  <option value="intermediate" className="bg-gray-800">Intermediate</option>
                  <option value="advanced" className="bg-gray-800">Advanced</option>
                </select>
              </div>
            </div>

            {/* Equipment Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-white font-semibold">Available Equipment</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {equipment.map((item) => (
                  <motion.button
                    key={item.value}
                    onClick={() => toggleEquipment(item.value)}
                    className={`p-3 rounded-xl border transition-all ${
                      preferences.equipment.includes(item.value)
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-white text-sm font-medium">{item.label}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="space-y-3 mb-6">
              <label className="text-white font-semibold">Focus Areas</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3"> {/* Corrected preferences.focus to preferences.focusAreas */}
                {focusAreas.map((area) => (
                  <motion.button
                    key={area.value}
                    onClick={() => toggleFocusArea(area.value)}
                    className={`p-3 rounded-xl border transition-all ${
                      preferences.focusAreas.includes(area.value)
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{area.icon}</div>
                      <div className="text-white text-sm font-medium">{area.label}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-white/10"
                >
                  <div className="space-y-2">
                    <label className="text-white font-semibold">Weekly Frequency</label>
                    <select
                      value={preferences.frequency}
                      onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="1-2" className="bg-gray-800">1-2 times per week</option>
                      <option value="3-4" className="bg-gray-800">3-4 times per week</option>
                      <option value="5-6" className="bg-gray-800">5-6 times per week</option>
                      <option value="daily" className="bg-gray-800">Daily</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerateWorkout}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: isGenerating ? 1 : 1.02 }}
              whileTap={{ scale: isGenerating ? 1 : 0.98 }}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  <span>Generating AI Workout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Workout</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Generated Workout Display */}
        <div className="space-y-6 lg:col-span-2">
          {generatedWorkout ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{generatedWorkout.name}</h4>
                  <p className="text-gray-300">{generatedWorkout.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{generatedWorkout.estimatedCalories}</div>
                  <div className="text-gray-400 text-sm">calories</div>
                </div>
              </div>

              {/* Workout Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-white font-semibold">{generatedWorkout.duration}</div>
                  <div className="text-gray-400 text-xs">Duration</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-semibold">{generatedWorkout.exercises.length}</div>
                  <div className="text-gray-400 text-xs">Exercises</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-white font-semibold">{generatedWorkout.difficulty}</div>
                  <div className="text-gray-400 text-xs">Level</div>
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-3 mb-6">
                <h5 className="text-white font-semibold">Exercises</h5>
                {generatedWorkout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h6 className="text-white font-semibold">{index + 1}. {exercise.name}</h6>
                        <p className="text-gray-400 text-sm">{exercise.muscleGroups.join(', ')}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-white">{exercise.sets} sets × {exercise.reps}</div>
                        <div className="text-gray-400">Rest: {exercise.rest}</div>
                      </div>
                    </div>
                    {exercise.notes && (
                      <p className="text-gray-300 text-sm italic">{exercise.notes}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  <span>Start Workout</span>
                </motion.button>
                
                <motion.button
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Plan</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
           <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutGenerator;