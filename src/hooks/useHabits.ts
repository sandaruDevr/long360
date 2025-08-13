import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Habit } from '../types/habit';
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markHabitCompleted,
  initializeDefaultHabits,
  subscribeToHabits
} from '../services/habitService';
import { format } from 'date-fns';

export const useHabits = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize default habits and subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadAndSubscribeHabits = async () => {
      try {
        setLoading(true);
        await initializeDefaultHabits(currentUser.uid); // Ensure defaults are set up
        
        const unsubscribe = subscribeToHabits(
          currentUser.uid,
          (fetchedHabits) => {
            // Update 'completed' status for today based on 'lastCompleted' date
            const today = format(new Date(), 'yyyy-MM-dd');
            const updatedHabits = fetchedHabits.map(habit => ({
              ...habit,
              completed: habit.lastCompleted === today // Mark as completed today if lastCompleted is today
            }));
            setHabits(updatedHabits);
            setLoading(false);
          }
        );
        return unsubscribe;
      } catch (err) {
        console.error('Error loading or subscribing to habits:', err);
        setError('Failed to load habits.');
        setLoading(false);
      }
    };

    const unsubscribePromise = loadAndSubscribeHabits();

    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [currentUser]);

  // Habit operations
  const addHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'userId' | 'completed' | 'streak' | 'lastCompleted' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    if (!currentUser) {
      setError('User not authenticated.');
      return;
    }
    try {
      await createHabit(currentUser.uid, habitData);
    } catch (err) {
      console.error('Error adding habit:', err);
      setError('Failed to add habit.');
      throw err;
    }
  }, [currentUser]);

  const updateHabitItem = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    if (!currentUser) {
      setError('User not authenticated.');
      return;
    }
    try {
      await updateHabit(currentUser.uid, habitId, updates);
    } catch (err) {
      console.error('Error updating habit:', err);
      setError('Failed to update habit.');
      throw err;
    }
  }, [currentUser]);

  const deleteHabitItem = useCallback(async (habitId: string) => {
    if (!currentUser) {
      setError('User not authenticated.');
      return;
    }
    try {
      await deleteHabit(currentUser.uid, habitId);
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError('Failed to delete habit.');
      throw err;
    }
  }, [currentUser]);

  const toggleHabitCompletion = useCallback(async (habitId: string, completed: boolean) => {
    if (!currentUser) {
      setError('User not authenticated.');
      return;
    }
    try {
      await markHabitCompleted(currentUser.uid, habitId, completed);
    } catch (err) {
      console.error('Error toggling habit completion:', err);
      setError('Failed to update habit completion.');
      throw err;
    }
  }, [currentUser]);

  const clearError = useCallback(() => setError(null), []);

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabitItem,
    deleteHabitItem,
    toggleHabitCompletion,
    clearError,
  };
};
