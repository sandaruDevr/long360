import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SleepEntry, SleepGoal, SleepAchievement, SleepStats } from '../types/sleep';
import {
  createSleepEntry,
  getSleepEntries,
  getSleepEntry,
  updateSleepEntry,
  deleteSleepEntry,
  createSleepGoal,
  getSleepGoals,
  updateSleepGoal,
  deleteSleepGoal,
  getUserSleepAchievements,
  calculateSleepStats,
  subscribeToSleepEntries,
  subscribeToSleepGoals,
  subscribeToSleepAchievements,
  updateSleepAchievementsProgress,
  initializeUserSleepAchievements
} from '../services/sleepService';

export const useSleep = () => {
  const { currentUser } = useAuth();
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [sleepGoals, setSleepGoals] = useState<SleepGoal[]>([]);
  const [sleepAchievements, setSleepAchievements] = useState<SleepAchievement[]>([]);
  const [sleepStats, setSleepStats] = useState<SleepStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load sleep entries
        const entries = await getSleepEntries(currentUser.uid);
        setSleepEntries(entries);

        // Load sleep goals
        const goals = await getSleepGoals(currentUser.uid);
        setSleepGoals(goals);

        // Load achievements
        let userAchievements = await getUserSleepAchievements(currentUser.uid);
        
        // Initialize achievements if none exist
        if (userAchievements.length === 0) {
          await initializeUserSleepAchievements(currentUser.uid);
          userAchievements = await getUserSleepAchievements(currentUser.uid);
        }
        
        setSleepAchievements(userAchievements);

        // Calculate stats
        const stats = await calculateSleepStats(currentUser.uid);
        setSleepStats(stats);

        // Update achievements based on current progress
        await updateSleepAchievementsProgress(currentUser.uid);

      } catch (err) {
        console.error('Error loading sleep data:', err);
        setError('Failed to load sleep data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeEntries = subscribeToSleepEntries(
      currentUser.uid,
      (entries) => setSleepEntries(entries)
    );

    const unsubscribeGoals = subscribeToSleepGoals(
      currentUser.uid,
      (goals) => setSleepGoals(goals)
    );

    const unsubscribeAchievements = subscribeToSleepAchievements(
      currentUser.uid,
      (achievements) => setSleepAchievements(achievements)
    );

    return () => {
      unsubscribeEntries();
      unsubscribeGoals();
      unsubscribeAchievements();
    };
  }, [currentUser]);

  // Recalculate stats when entries change
  useEffect(() => {
    if (!currentUser || sleepEntries.length === 0) return;

    const updateStats = async () => {
      try {
        const stats = await calculateSleepStats(currentUser.uid);
        setSleepStats(stats);
        
        // Update achievements
        await updateSleepAchievementsProgress(currentUser.uid);
        const updatedAchievements = await getUserSleepAchievements(currentUser.uid);
        setSleepAchievements(updatedAchievements);
      } catch (err) {
        console.error('Error updating sleep stats:', err);
      }
    };

    updateStats();
  }, [sleepEntries, currentUser]);

  // Sleep Entry Operations
  const addSleepEntry = useCallback(async (entryData: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await createSleepEntry(currentUser.uid, entryData);
    } catch (err) {
      console.error('Error adding sleep entry:', err);
      setError('Failed to add sleep entry');
      throw err;
    }
  }, [currentUser]);

  const updateEntry = useCallback(async (entryId: string, updates: Partial<SleepEntry>) => {
    if (!currentUser) return;

    try {
      await updateSleepEntry(currentUser.uid, entryId, updates);
    } catch (err) {
      console.error('Error updating sleep entry:', err);
      setError('Failed to update sleep entry');
      throw err;
    }
  }, [currentUser]);

  const removeEntry = useCallback(async (entryId: string) => {
    if (!currentUser) return;

    try {
      await deleteSleepEntry(currentUser.uid, entryId);
    } catch (err) {
      console.error('Error deleting sleep entry:', err);
      setError('Failed to delete sleep entry');
      throw err;
    }
  }, [currentUser]);

  // Sleep Goal Operations
  const addSleepGoal = useCallback(async (goalData: Omit<SleepGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await createSleepGoal(currentUser.uid, goalData);
    } catch (err) {
      console.error('Error adding sleep goal:', err);
      setError('Failed to add sleep goal');
      throw err;
    }
  }, [currentUser]);

  const updateSleepGoalItem = useCallback(async (goalId: string, updates: Partial<SleepGoal>) => {
    if (!currentUser) return;

    try {
      await updateSleepGoal(currentUser.uid, goalId, updates);
    } catch (err) {
      console.error('Error updating sleep goal:', err);
      setError('Failed to update sleep goal');
      throw err;
    }
  }, [currentUser]);

  const removeSleepGoal = useCallback(async (goalId: string) => {
    if (!currentUser) return;

    try {
      await deleteSleepGoal(currentUser.uid, goalId);
    } catch (err) {
      console.error('Error deleting sleep goal:', err);
      setError('Failed to delete sleep goal');
      throw err;
    }
  }, [currentUser]);

  // Get today's sleep entry
  const getTodayEntry = useCallback((): SleepEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    return sleepEntries.find(entry => entry.date === today) || null;
  }, [sleepEntries]);

  // Get latest sleep entry
  const getLatestEntry = useCallback((): SleepEntry | null => {
    return sleepEntries.length > 0 ? sleepEntries[0] : null;
  }, [sleepEntries]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // Data
    sleepEntries,
    sleepGoals,
    sleepAchievements,
    sleepStats,
    loading,
    error,
    
    // Entry Operations
    addSleepEntry,
    updateEntry,
    removeEntry,
    
    // Goal Operations
    addSleepGoal,
    updateSleepGoalItem,
    removeSleepGoal,
    
    // Utilities
    getTodayEntry,
    getLatestEntry,
    clearError
  };
};