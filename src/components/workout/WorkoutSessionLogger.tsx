import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Zap, 
  Plus, 
  Minus,
  Star,
  Save,
  X,
  CheckCircle,
  Timer,
  Target,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Award,
  TrendingUp,
  Activity,
  Heart,
  Brain,
  Info,
  Volume2,
  VolumeX,
  Settings,
  Flame,
  Trophy,
  Calendar,
  User,
  Bookmark,
  Share2,
  BarChart3
} from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { WorkoutPlan, ExerciseLog, SetLog } from '../../types/workout';

interface WorkoutSessionLoggerProps {
  workoutPlan?: WorkoutPlan;
  onClose: () => void;
  onComplete: (sessionData: any) => void;
}

const WorkoutSessionLogger: React.FC<WorkoutSessionLoggerProps> = ({
  workoutPlan,
  onClose,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [sessionRating, setSessionRating] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [estimatedCalories, setEstimatedCalories] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [workoutPhase, setWorkoutPhase] = useState<'pre' | 'active' | 'complete'>('pre');
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Initialize exercise logs
  useEffect(() => {
    if (workoutPlan) {
      const initialLogs: ExerciseLog[] = workoutPlan.exercises.map(exercise => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: Array.from({ length: exercise.sets }, (_, index) => ({
          setNumber: index + 1,
          reps: 0,
          weight: 0,
          completed: false,
          rpe: 5
        })),
        notes: '',
        completed: false
      }));
      setExerciseLogs(initialLogs);
    }
  }, [workoutPlan]);

  // Main timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            if (soundEnabled) {
              console.log('🔔 Rest complete!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isResting, restTimer, soundEnabled]);

  // Calculate estimated calories
  useEffect(() => {
    const minutes = elapsedTime / 60;
    const baseCaloriesPerMinute = workoutPlan?.focusAreas.includes('cardio') ? 12 : 8;
    const intensityMultiplier = workoutPlan?.difficulty === 'advanced' ? 1.3 : 
                               workoutPlan?.difficulty === 'intermediate' ? 1.1 : 1.0;
    setEstimatedCalories(Math.round(minutes * baseCaloriesPerMinute * intensityMultiplier));
  }, [elapsedTime, workoutPlan]);

  const startWorkout = () => {
    setIsActive(true);
    setStartTime(new Date());
    setWorkoutPhase('active');
    setShowInstructions(true);
  };

  const pauseWorkout = () => {
    setIsActive(false);
  };

  const resumeWorkout = () => {
    if (startTime) {
      const pausedDuration = elapsedTime;
      setStartTime(new Date(Date.now() - pausedDuration * 1000));
      setIsActive(true);
    }
  };

  const startRestTimer = (duration: number) => {
    setRestTimer(duration);
    setIsResting(true);
    if (soundEnabled) {
      console.log('🔔 Rest timer started');
    }
  };

  const completeWorkout = () => {
    const sessionData = {
      workoutPlanId: workoutPlan?.id,
      planName: workoutPlan?.name || 'Custom Workout',
      date: new Date().toISOString().split('T')[0],
      startTime: startTime?.toISOString() || new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: Math.round(elapsedTime / 60),
      caloriesBurned: estimatedCalories,
      exercisesPerformed: exerciseLogs,
      completed: true,
      rating: sessionRating,
      notes: sessionNotes
    };
    
    onComplete(sessionData);
  };

  const updateSetLog = (exerciseIndex: number, setIndex: number, updates: Partial<SetLog>) => {
    setExerciseLogs(prev => prev.map((exercise, exIndex) => 
      exIndex === exerciseIndex 
        ? {
            ...exercise,
            sets: exercise.sets.map((set, setIdx) => 
              setIdx === setIndex ? { ...set, ...updates } : set
            )
          }
        : exercise
    ));
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    updateSetLog(exerciseIndex, setIndex, { completed: true });
    
    const exerciseId = exerciseLogs[exerciseIndex]?.exerciseId;
    if (exerciseId) {
      setCompletedSets(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
    }

    const currentExercise = workoutPlan?.exercises[exerciseIndex];
    if (currentExercise && setIndex < currentExercise.sets - 1) {
      const restSeconds = parseInt(currentExercise.rest.split('-')[0]) || 90;
      startRestTimer(restSeconds);
    }

    const exerciseLog = exerciseLogs[exerciseIndex];
    if (exerciseLog && exerciseLog.sets.every((set, idx) => idx === setIndex || set.completed)) {
      if (autoAdvance) {
        setTimeout(() => {
          markExerciseComplete(exerciseIndex);
        }, 1000);
      }
    }
  };

  const markExerciseComplete = (exerciseIndex: number) => {
    setExerciseLogs(prev => prev.map((exercise, index) => 
      index === exerciseIndex 
        ? { ...exercise, completed: true }
        : exercise
    ));
    
    if (exerciseIndex < exerciseLogs.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
      setShowInstructions(true);
    } else {
      setWorkoutPhase('complete');
    }
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setShowInstructions(true);
    }
  };

  const goToNextExercise = () => {
    if (currentExerciseIndex < exerciseLogs.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setShowInstructions(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = workoutPlan?.exercises[currentExerciseIndex];
  const currentExerciseLog = exerciseLogs[currentExerciseIndex];
  const completedExercises = exerciseLogs.filter(e => e.completed).length;
  const totalSets = exerciseLogs.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSetsCount = exerciseLogs.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const overallProgress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;

  const getRPEColor = (rpe: number) => {
    if (rpe <= 3) return 'text-emerald-400';
    if (rpe <= 6) return 'text-yellow-400';
    if (rpe <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRPEDescription = (rpe: number) => {
    if (rpe <= 3) return 'Easy';
    if (rpe <= 6) return 'Moderate';
    if (rpe <= 8) return 'Hard';
    return 'Max Effort';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-xl border-b border-orange-500/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-white">{workoutPlan?.name || 'Custom Workout'}</h2>
                <p className="text-gray-300 text-lg">{workoutPlan?.description || 'Personalized workout session'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5 text-white" />
              </motion.button>
              
              <motion.button
                onClick={onClose}
                className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-red-400" />
              </motion.button>
            </div>
          </div>

          {/* Enhanced Stats Display */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-bold text-orange-400 mb-1">{formatTime(elapsedTime)}</div>
              <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Duration</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-bold text-blue-400 mb-1">{estimatedCalories}</div>
              <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Calories</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-bold text-emerald-400 mb-1">{completedExercises}/{exerciseLogs.length}</div>
              <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
                <Target className="w-3 h-3" />
                <span>Exercises</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-bold text-purple-400 mb-1">{completedSetsCount}/{totalSets}</div>
              <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
                <Award className="w-3 h-3" />
                <span>Sets</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-bold text-pink-400 mb-1">{Math.round(overallProgress)}%</div>
              <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Progress</span>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-lg">Workout Progress</span>
              <span className="text-orange-400 font-bold text-lg">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Exercise Progress Indicators */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {exerciseLogs.map((exercise, index) => (
              <motion.button
                key={exercise.exerciseId}
                onClick={() => setCurrentExerciseIndex(index)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold transition-all ${
                  exercise.completed 
                    ? 'bg-emerald-500 border-emerald-400 text-white' 
                    : index === currentExerciseIndex 
                    ? 'bg-orange-500 border-orange-400 text-white' 
                    : 'bg-white/10 border-white/30 text-gray-400 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {exercise.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-slate-800 rounded-2xl border border-white/20 p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-6">Workout Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Sound Effects</span>
                    </div>
                    <motion.button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        soundEnabled ? 'bg-emerald-500' : 'bg-gray-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: soundEnabled ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Auto-advance</span>
                    </div>
                    <motion.button
                      onClick={() => setAutoAdvance(!autoAdvance)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        autoAdvance ? 'bg-emerald-500' : 'bg-gray-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: autoAdvance ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close Settings
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest Timer Overlay */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-40"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl border border-blue-500/30 p-12 text-center max-w-md w-full mx-4"
              >
                <div className="w-40 h-40 mx-auto mb-8 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (restTimer / 90)}`}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div 
                        className="text-5xl font-black text-white mb-2"
                        animate={{ scale: restTimer <= 10 ? [1, 1.1, 1] : 1 }}
                        transition={{ duration: 1, repeat: restTimer <= 10 ? Infinity : 0 }}
                      >
                        {restTimer}
                      </motion.div>
                      <div className="text-blue-400 text-lg font-semibold">seconds</div>
                    </div>
                  </div>
                </div>

                <motion.h3 
                  className="text-3xl font-bold text-white mb-3"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💪 Rest Time
                </motion.h3>
                <p className="text-gray-300 text-lg mb-8">Recover and prepare for your next set</p>
                
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    onClick={() => setIsResting(false)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 px-8 py-4 rounded-xl font-semibold transition-all flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>Skip Rest</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setRestTimer(prev => prev + 30)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-xl font-semibold transition-all flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                    <span>+30s</span>
                  </motion.button>
                </div>

                {currentExerciseIndex < exerciseLogs.length - 1 && (
                  <div className="mt-8 pt-6 border-t border-blue-500/30">
                    <p className="text-blue-400 text-sm mb-2">Next Exercise:</p>
                    <p className="text-white font-semibold">
                      {workoutPlan?.exercises[currentExerciseIndex + 1]?.name}
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {workoutPhase === 'pre' && (
              <motion.div
                key="pre-workout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8"
              >
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-40 h-40 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                  >
                    <Play className="w-20 h-20 text-white ml-2" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-4xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Ready to Crush This Workout? 🔥
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-300 text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {workoutPlan ? `${workoutPlan.exercises.length} exercises • ${workoutPlan.duration} minutes • ${workoutPlan.estimatedCalories} calories` : 'Custom workout session'}
                  </motion.p>
                  
                  {workoutPlan && (
                    <motion.div 
                      className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8 max-w-5xl mx-auto"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h4 className="text-2xl font-bold text-white mb-6 flex items-center justify-center space-x-3">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <span>Workout Preview</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workoutPlan.exercises.map((exercise, index) => (
                          <motion.div 
                            key={exercise.id} 
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-semibold text-lg">{index + 1}. {exercise.name}</span>
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{exercise.sets}</span>
                              </div>
                            </div>
                            <div className="text-gray-400 text-sm mb-2">{exercise.reps} reps • {exercise.rest} rest</div>
                            <div className="flex flex-wrap gap-1">
                              {exercise.muscleGroups.slice(0, 2).map((muscle, muscleIndex) => (
                                <span key={muscleIndex} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                                  {muscle}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={startWorkout}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-16 py-8 rounded-3xl font-bold text-2xl hover:from-orange-600 hover:to-red-700 transition-all shadow-2xl hover:shadow-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center space-x-4">
                      <Play className="w-10 h-10" />
                      <span>Start Workout</span>
                      <Flame className="w-10 h-10" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {workoutPhase === 'active' && currentExercise && currentExerciseLog && (
              <motion.div
                key="active-workout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-6"
              >
                {/* Exercise Navigation */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.button
                      onClick={goToPreviousExercise}
                      disabled={currentExerciseIndex === 0}
                      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-6 py-3 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: currentExerciseIndex > 0 ? 1.05 : 1 }}
                      whileTap={{ scale: currentExerciseIndex > 0 ? 0.95 : 1 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Previous</span>
                    </motion.button>

                    <div className="text-center">
                      <div className="text-white font-bold text-2xl mb-1">
                        Exercise {currentExerciseIndex + 1} of {exerciseLogs.length}
                      </div>
                      <div className="text-gray-400 text-lg">
                        {currentExercise.muscleGroups.join(' • ')}
                      </div>
                    </div>

                    <motion.button
                      onClick={goToNextExercise}
                      disabled={currentExerciseIndex === exerciseLogs.length - 1}
                      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-6 py-3 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: currentExerciseIndex < exerciseLogs.length - 1 ? 1.05 : 1 }}
                      whileTap={{ scale: currentExerciseIndex < exerciseLogs.length - 1 ? 0.95 : 1 }}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Exercise Progress</span>
                      <span className="text-orange-400 font-semibold">
                        {currentExerciseLog.sets.filter(s => s.completed).length}/{currentExerciseLog.sets.length} sets
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                        animate={{ width: `${(currentExerciseLog.sets.filter(s => s.completed).length / currentExerciseLog.sets.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Current Exercise Display */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <motion.h3 
                        className="text-4xl font-bold text-white mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {currentExercise.name}
                      </motion.h3>
                      <div className="flex items-center space-x-6 text-lg">
                        <div className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-orange-400" />
                          <span className="text-orange-400 font-semibold">{currentExercise.sets} sets</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400 font-semibold">{currentExercise.reps} reps</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Timer className="w-5 h-5 text-purple-400" />
                          <span className="text-purple-400 font-semibold">Rest: {currentExercise.rest}</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => setShowInstructions(!showInstructions)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                        showInstructions 
                          ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300' 
                          : 'bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info className="w-5 h-5" />
                      <span>{showInstructions ? 'Hide' : 'Show'} Guide</span>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showInstructions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h5 className="text-white font-bold text-lg mb-3 flex items-center space-x-2">
                              <Brain className="w-5 h-5 text-blue-400" />
                              <span>How to Perform</span>
                            </h5>
                            <p className="text-gray-300 leading-relaxed mb-4">{currentExercise.instructions}</p>
                          </div>
                          
                          {currentExercise.tips && (
                            <div>
                              <h5 className="text-white font-bold text-lg mb-3 flex items-center space-x-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <span>Pro Tips</span>
                              </h5>
                              <p className="text-gray-300 leading-relaxed">{currentExercise.tips}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-blue-500/30">
                          <h6 className="text-white font-semibold mb-3">Muscles Targeted:</h6>
                          <div className="flex flex-wrap gap-2">
                            {currentExercise.muscleGroups.map((muscle, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm font-medium">
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sets Logging */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h5 className="text-white font-bold text-2xl flex items-center space-x-3">
                        <Award className="w-6 h-6 text-yellow-400" />
                        <span>Log Your Sets</span>
                      </h5>
                      <div className="text-gray-300">
                        <span className="text-emerald-400 font-bold">{currentExerciseLog.sets.filter(s => s.completed).length}</span>
                        <span> / {currentExerciseLog.sets.length} completed</span>
                      </div>
                    </div>

                    {currentExerciseLog.sets.map((set, setIndex) => (
                      <motion.div
                        key={setIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: setIndex * 0.1 }}
                        className={`bg-white/5 rounded-2xl p-6 border transition-all ${
                          set.completed 
                            ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg' 
                            : 'border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              set.completed 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                            }`}>
                              {set.completed ? <CheckCircle className="w-6 h-6" /> : set.setNumber}
                            </div>
                            <div>
                              <span className="text-white font-bold text-xl">Set {set.setNumber}</span>
                              {set.completed && (
                                <div className="flex items-center space-x-2 mt-1">
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  <span className="text-emerald-400 text-sm font-medium">Completed</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-gray-400 text-sm">Target</div>
                            <div className="text-white font-semibold">{currentExercise.reps} reps</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div>
                            <label className="text-gray-400 text-sm font-semibold mb-2 block flex items-center space-x-1">
                              <Activity className="w-3 h-3" />
                              <span>Reps</span>
                            </label>
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => updateSetLog(currentExerciseIndex, setIndex, { reps: Number(e.target.value) })}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center text-lg font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                              placeholder={currentExercise.reps}
                              disabled={set.completed}
                            />
                          </div>
                          
                          <div>
                            <label className="text-gray-400 text-sm font-semibold mb-2 block flex items-center space-x-1">
                              <Target className="w-3 h-3" />
                              <span>Weight (lbs)</span>
                            </label>
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => updateSetLog(currentExerciseIndex, setIndex, { weight: Number(e.target.value) })}
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-center text-lg font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                              placeholder="0"
                              disabled={set.completed}
                            />
                          </div>
                          
                          <div>
                            <label className="text-gray-400 text-sm font-semibold mb-2 block flex items-center space-x-1">
                              <Heart className="w-3 h-3" />
                              <span>RPE (1-10)</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={set.rpe || ''}
                              onChange={(e) => updateSetLog(currentExerciseIndex, setIndex, { rpe: Number(e.target.value) })}
                              className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center text-lg font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all ${getRPEColor(set.rpe || 5)}`}
                              placeholder="5"
                              disabled={set.completed}
                            />
                            <div className="text-center mt-1">
                              <span className={`text-xs font-medium ${getRPEColor(set.rpe || 5)}`}>
                                {getRPEDescription(set.rpe || 5)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-end">
                            {!set.completed ? (
                              <motion.button
                                onClick={() => completeSet(currentExerciseIndex, setIndex)}
                                disabled={!set.reps}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                whileHover={{ scale: set.reps ? 1.05 : 1 }}
                                whileTap={{ scale: set.reps ? 0.95 : 1 }}
                              >
                                Complete Set
                              </motion.button>
                            ) : (
                              <div className="w-full bg-emerald-500/20 text-emerald-400 py-3 rounded-xl font-bold text-lg text-center border border-emerald-500/30 flex items-center justify-center space-x-2">
                                <CheckCircle className="w-5 h-5" />
                                <span>Completed</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {set.completed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/20 rounded-xl p-3 border border-emerald-500/30"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-emerald-400 font-medium">
                                ✅ {set.reps} reps @ {set.weight}lbs
                              </span>
                              <span className={`font-medium ${getRPEColor(set.rpe || 5)}`}>
                                RPE {set.rpe} ({getRPEDescription(set.rpe || 5)})
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="text-white text-lg">
                          <span className="font-semibold">Sets completed: </span>
                          <span className="text-emerald-400 font-bold text-xl">
                            {currentExerciseLog.sets.filter(s => s.completed).length}/{currentExerciseLog.sets.length}
                          </span>
                        </div>

                        {currentExerciseLog.sets.every(s => s.completed) && (
                          <motion.button
                            onClick={() => markExerciseComplete(currentExerciseIndex)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center space-x-3 shadow-xl hover:shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle className="w-6 h-6" />
                            <span>
                              {currentExerciseIndex === exerciseLogs.length - 1 ? 'Finish Workout 🎉' : 'Next Exercise →'}
                            </span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercise Overview */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    <span>Workout Overview</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exerciseLogs.map((exercise, index) => {
                      const exerciseData = workoutPlan?.exercises[index];
                      const setsCompleted = exercise.sets.filter(s => s.completed).length;
                      const setsTotal = exercise.sets.length;
                      const exerciseProgress = (setsCompleted / setsTotal) * 100;
                      
                      return (
                        <motion.div
                          key={exercise.exerciseId}
                          onClick={() => setCurrentExerciseIndex(index)}
                          className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer ${
                            exercise.completed 
                              ? 'border-emerald-500/30 bg-emerald-500/10' 
                              : index === currentExerciseIndex 
                              ? 'border-orange-500/30 bg-orange-500/10' 
                              : 'border-white/10 hover:bg-white/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-semibold truncate">{exercise.exerciseName}</span>
                            <div className="flex items-center space-x-2">
                              {exercise.completed ? (
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                              ) : index === currentExerciseIndex ? (
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">{index + 1}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-400 text-sm">Progress</span>
                              <span className="text-white text-sm font-medium">{setsCompleted}/{setsTotal}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  exercise.completed 
                                    ? 'bg-emerald-500' 
                                    : index === currentExerciseIndex 
                                    ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                                    : 'bg-gray-500'
                                }`}
                                animate={{ width: `${exerciseProgress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            {exerciseData?.sets} sets • {exerciseData?.reps} reps
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {workoutPhase === 'complete' && (
              <motion.div
                key="complete-workout"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8"
              >
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-40 h-40 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                  >
                    <Trophy className="w-20 h-20 text-white" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Workout Complete! 🎉
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-300 text-xl mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Outstanding work! You've crushed all {exerciseLogs.length} exercises in {formatTime(elapsedTime)}.
                  </motion.p>

                  <motion.div 
                    className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h4 className="text-2xl font-bold text-white mb-6 flex items-center justify-center space-x-3">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                      <span>Session Summary</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-orange-400 mb-1">{formatTime(elapsedTime)}</div>
                        <div className="text-gray-400 text-sm">Duration</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-blue-400 mb-1">{estimatedCalories}</div>
                        <div className="text-gray-400 text-sm">Calories</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-400 mb-1">{completedSetsCount}</div>
                        <div className="text-gray-400 text-sm">Sets</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-purple-400 mb-1">{completedExercises}</div>
                        <div className="text-gray-400 text-sm">Exercises</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-8">
                      <label className="block text-white font-bold text-xl mb-4 text-center">Rate this workout:</label>
                      <div className="flex items-center justify-center space-x-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            onClick={() => setSessionRating(star)}
                            className={`w-16 h-16 ${star <= sessionRating ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-300 transition-colors`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Star className="w-full h-full fill-current" />
                          </motion.button>
                        ))}
                      </div>
                      {sessionRating > 0 && (
                        <motion.p 
                          className="text-center text-gray-300 mt-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {sessionRating === 5 ? 'Amazing workout! 🔥' : 
                           sessionRating === 4 ? 'Great session! 💪' : 
                           sessionRating === 3 ? 'Good effort! 👍' : 
                           sessionRating === 2 ? 'Room for improvement 📈' : 
                           'Better luck next time! 💪'}
                        </motion.p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="mb-8">
                      <label className="block text-white font-bold text-xl mb-4 text-center">Session notes (optional):</label>
                      <textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        placeholder="How did you feel? Any observations or improvements for next time?"
                        className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none text-lg"
                        rows={4}
                      />
                    </div>

                    {/* Performance Insights */}
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30 mb-8">
                      <h5 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-emerald-400" />
                        <span>Performance Insights</span>
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-gray-300">
                            Average RPE: <span className="text-white font-semibold">
                              {Math.round(exerciseLogs.reduce((sum, ex) => 
                                sum + ex.sets.reduce((setSum, set) => setSum + (set.rpe || 5), 0), 0
                              ) / totalSets * 10) / 10}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">
                            Total Volume: <span className="text-white font-semibold">
                              {exerciseLogs.reduce((sum, ex) => 
                                sum + ex.sets.reduce((setSum, set) => setSum + ((set.weight || 0) * (set.reps || 0)), 0), 0
                              ).toLocaleString()} lbs
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={completeWorkout}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-16 py-8 rounded-3xl font-bold text-2xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl hover:shadow-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center space-x-4">
                      <Save className="w-10 h-10" />
                      <span>Save & Complete</span>
                      <Trophy className="w-10 h-10" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Footer Controls */}
        <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 p-6">
          {workoutPhase === 'active' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!isActive ? (
                  <motion.button
                    onClick={resumeWorkout}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl px-8 py-4 text-emerald-400 font-bold text-lg transition-all flex items-center space-x-3 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6" />
                    <span>Resume Workout</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={pauseWorkout}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-xl px-8 py-4 text-yellow-400 font-bold text-lg transition-all flex items-center space-x-3 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pause className="w-6 h-6" />
                    <span>Pause Workout</span>
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setWorkoutPhase('complete')}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl px-8 py-4 text-red-400 font-bold text-lg transition-all flex items-center space-x-3 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Square className="w-6 h-6" />
                  <span>End Early</span>
                </motion.button>
              </div>

              <div className="text-center">
                <div className="text-white font-bold text-xl mb-1">
                  {Math.round(overallProgress)}% Complete
                </div>
                <div className="text-gray-400">
                  {completedSetsCount}/{totalSets} sets • {completedExercises}/{exerciseLogs.length} exercises
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => startRestTimer(60)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl px-6 py-3 text-blue-400 font-semibold transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Timer className="w-5 h-5" />
                  <span>Rest 60s</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
    </motion.div>
  );
};


export default WorkoutSessionLogger