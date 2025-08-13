import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  WorkoutPlan,
  WorkoutSession,
  Achievement,
  WorkoutStats,
  WorkoutPreferences
} from '../types/workout';
import {
  createWorkoutPlan,
  getWorkoutPlans,
  getWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  logWorkoutSession,
  getWorkoutSessions,
  getWorkoutSessionsByDateRange,
  getUserAchievements,
  calculateWorkoutStats,
  subscribeToWorkoutPlans,
  subscribeToWorkoutSessions,
  updateAchievementsProgress,
  initializeUserAchievements
} from '../services/workoutService';
import { generateWorkoutPlan, WorkoutPreferences } from '../services/openai';

export const useWorkout = () => {
  const { currentUser } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load initial data
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load workout plans
        const plans = await getWorkoutPlans(currentUser.uid);
        setWorkoutPlans(plans);

        // Load workout sessions
        const sessions = await getWorkoutSessions(currentUser.uid, 50);
        setWorkoutSessions(sessions);

        // Load achievements
        let userAchievements = await getUserAchievements(currentUser.uid);
        
        // Initialize achievements if none exist
        if (userAchievements.length === 0) {
          await initializeUserAchievements(currentUser.uid);
          userAchievements = await getUserAchievements(currentUser.uid);
        }
        
        setAchievements(userAchievements);

        // Calculate stats
        const stats = await calculateWorkoutStats(currentUser.uid);
        setWorkoutStats(stats);

        // Update achievements based on current progress
        await updateAchievementsProgress(currentUser.uid);

      } catch (err) {
        console.error('Error loading workout data:', err);
        setError('Failed to load workout data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribePlans = subscribeToWorkoutPlans(
      currentUser.uid,
      (plans) => setWorkoutPlans(plans)
    );

    const unsubscribeSessions = subscribeToWorkoutSessions(
      currentUser.uid,
      (sessions) => setWorkoutSessions(sessions)
    );

    return () => {
      unsubscribePlans();
      unsubscribeSessions();
    };
  }, [currentUser]);

  // Recalculate stats when sessions change
  useEffect(() => {
    if (!currentUser || workoutSessions.length === 0) return;

    const updateStats = async () => {
      try {
        const stats = await calculateWorkoutStats(currentUser.uid);
        setWorkoutStats(stats);
        
        // Update achievements
        await updateAchievementsProgress(currentUser.uid);
        const updatedAchievements = await getUserAchievements(currentUser.uid);
        setAchievements(updatedAchievements);
      } catch (err) {
        console.error('Error updating stats:', err);
      }
    };

    updateStats();
  }, [workoutSessions, currentUser]);

  // Workout Plan Operations
  const addPlan = useCallback(async (planData: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await createWorkoutPlan(currentUser.uid, planData);
    } catch (err) {
      console.error('Error adding workout plan:', err);
      setError('Failed to add workout plan');
      throw err;
    }
  }, [currentUser]);

  const updatePlan = useCallback(async (planId: string, updates: Partial<WorkoutPlan>) => {
    if (!currentUser) return;

    try {
      await updateWorkoutPlan(currentUser.uid, planId, updates);
    } catch (err) {
      console.error('Error updating workout plan:', err);
      setError('Failed to update workout plan');
      throw err;
    }
  }, [currentUser]);

  const removePlan = useCallback(async (planId: string) => {
    if (!currentUser) return;

    try {
      await deleteWorkoutPlan(currentUser.uid, planId);
    } catch (err) {
      console.error('Error deleting workout plan:', err);
      setError('Failed to delete workout plan');
      throw err;
    }
  }, [currentUser]);

  // Workout Session Operations
  const logSession = useCallback(async (sessionData: Omit<WorkoutSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await logWorkoutSession(currentUser.uid, sessionData);
    } catch (err) {
      console.error('Error logging workout session:', err);
      setError('Failed to log workout session');
      throw err;
    }
  }, [currentUser]);

  // AI Workout Generation
  const generateAIWorkout = useCallback(async (preferences: WorkoutPreferences): Promise<WorkoutPlan> => {
    if (!currentUser) throw new Error('User not authenticated');

    setIsGenerating(true);
    try {
      const generatedPlan = await generateWorkoutPlan(preferences);
      
      // Save the generated plan to Firebase
      const planData = {
        name: generatedPlan.name,
        description: generatedPlan.description,
        duration: generatedPlan.duration,
        difficulty: generatedPlan.difficulty,
        focusAreas: generatedPlan.focusAreas,
        exercises: generatedPlan.exercises,
        estimatedCalories: generatedPlan.estimatedCalories,
        isActive: true
      };
      
      await addPlan(planData);
      
      // Return the complete workout plan object
      return {
        id: '', // Will be set by Firebase
        userId: currentUser.uid,
        ...planData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error generating AI workout:', err);
      setError('Failed to generate AI workout');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [currentUser]);

  // Get sessions for specific date range (for calendar)
  const getSessionsForDateRange = useCallback(async (startDate: string, endDate: string): Promise<WorkoutSession[]> => {
    if (!currentUser) return [];

    try {
      return await getWorkoutSessionsByDateRange(currentUser.uid, startDate, endDate);
    } catch (err) {
      console.error('Error getting sessions for date range:', err);
      setError('Failed to load calendar data');
      return [];
    }
  }, [currentUser]);

  // Quick session logging (for "Start Workout" buttons)
  const startQuickWorkout = useCallback(async (planId?: string, planName?: string): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const sessionData = {
        workoutPlanId: planId,
        planName: planName || 'Quick Workout',
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
        durationMinutes: 0,
        caloriesBurned: 0,
        exercisesPerformed: [],
        completed: false
      };

      return await logWorkoutSession(currentUser.uid, sessionData);
    } catch (err) {
      console.error('Error starting quick workout:', err);
      setError('Failed to start workout');
      throw err;
    }
  }, [currentUser]);

  // Complete workout session
  const completeWorkoutSession = useCallback(async (
    sessionId: string, 
    durationMinutes: number, 
    caloriesBurned: number, 
    rating?: number
  ) => {
    if (!currentUser) return;

    try {
      const sessionRef = ref(database, `workouts/sessions/${currentUser.uid}/${sessionId}`);
      const snapshot = await get(sessionRef);
      
      if (snapshot.exists()) {
        const session = snapshot.val() as WorkoutSession;
        await set(sessionRef, {
          ...session,
          endTime: new Date().toISOString(),
          durationMinutes,
          caloriesBurned,
          rating,
          completed: true,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error completing workout session:', err);
      setError('Failed to complete workout');
      throw err;
    }
  }, [currentUser]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // Data
    workoutPlans,
    workoutSessions,
    achievements,
    workoutStats,
    loading,
    error,
    isGenerating,
    
    // Plan Operations
    addPlan,
    updatePlan,
    removePlan,
    
    // Session Operations
    logSession,
    startQuickWorkout,
    completeWorkoutSession,
    getSessionsForDateRange,
    
    // AI Operations
    generateAIWorkout,
    
    // Utilities
    clearError
  };
};