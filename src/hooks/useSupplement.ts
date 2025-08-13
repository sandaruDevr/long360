import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Supplement, SupplementGoal, SupplementStats } from '../types/supplement';
import {
  createSupplement,
  getSupplements,
  updateSupplement,
  deleteSupplement,
  createSupplementGoal,
  getSupplementGoals,
  updateSupplementGoal,
  deleteSupplementGoal,
  subscribeToSupplements,
  subscribeToSupplementGoals,
  calculateSupplementStats,
  updateSupplementAdherence
} from '../services/supplementService';

export const useSupplement = () => {
  const { currentUser } = useAuth();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [supplementGoals, setSupplementGoals] = useState<SupplementGoal[]>([]);
  const [supplementStats, setSupplementStats] = useState<SupplementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load supplements
        const userSupplements = await getSupplements(currentUser.uid);
        setSupplements(userSupplements);

        // Load goals
        const userGoals = await getSupplementGoals(currentUser.uid);
        setSupplementGoals(userGoals);

        // Calculate stats
        const stats = calculateSupplementStats(userSupplements, userGoals);
        setSupplementStats(stats);

      } catch (err) {
        console.error('Error loading supplement data:', err);
        setError('Failed to load supplement data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeSupplements = subscribeToSupplements(
      currentUser.uid,
      (supplements) => {
        setSupplements(supplements);
      }
    );

    const unsubscribeGoals = subscribeToSupplementGoals(
      currentUser.uid,
      (goals) => {
        setSupplementGoals(goals);
      }
    );

    return () => {
      unsubscribeSupplements();
      unsubscribeGoals();
    };
  }, [currentUser]);

  // Recalculate stats when supplements or goals change
  useEffect(() => {
    if (supplements.length > 0 || supplementGoals.length > 0) {
      const stats = calculateSupplementStats(supplements, supplementGoals);
      setSupplementStats(stats);
    }
  }, [supplements, supplementGoals]);

  // Supplement Operations
  const addSupplement = useCallback(async (supplementData: Omit<Supplement, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await createSupplement(currentUser.uid, supplementData);
    } catch (err) {
      console.error('Error adding supplement:', err);
      setError('Failed to add supplement');
      throw err;
    }
  }, [currentUser]);

  const updateSupplementItem = useCallback(async (supplementId: string, updates: Partial<Supplement>) => {
    if (!currentUser) return;

    try {
      await updateSupplement(currentUser.uid, supplementId, updates);
    } catch (err) {
      console.error('Error updating supplement:', err);
      setError('Failed to update supplement');
      throw err;
    }
  }, [currentUser]);

  const removeSupplement = useCallback(async (supplementId: string) => {
    if (!currentUser) return;

    try {
      await deleteSupplement(currentUser.uid, supplementId);
    } catch (err) {
      console.error('Error deleting supplement:', err);
      setError('Failed to delete supplement');
      throw err;
    }
  }, [currentUser]);

  // Goal Operations
  const addGoal = useCallback(async (goalData: Omit<SupplementGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      await createSupplementGoal(currentUser.uid, goalData);
    } catch (err) {
      console.error('Error adding supplement goal:', err);
      setError('Failed to add goal');
      throw err;
    }
  }, [currentUser]);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<SupplementGoal>) => {
    if (!currentUser) return;

    try {
      await updateSupplementGoal(currentUser.uid, goalId, updates);
    } catch (err) {
      console.error('Error updating supplement goal:', err);
      setError('Failed to update goal');
      throw err;
    }
  }, [currentUser]);

  const removeGoal = useCallback(async (goalId: string) => {
    if (!currentUser) return;

    try {
      await deleteSupplementGoal(currentUser.uid, goalId);
    } catch (err) {
      console.error('Error deleting supplement goal:', err);
      setError('Failed to delete goal');
      throw err;
    }
  }, [currentUser]);

  // Adherence tracking
  const markSupplementTaken = useCallback(async (supplementId: string, taken: boolean = true) => {
    if (!currentUser) return;

    try {
      await updateSupplementAdherence(currentUser.uid, supplementId, taken);
    } catch (err) {
      console.error('Error updating adherence:', err);
      setError('Failed to update adherence');
      throw err;
    }
  }, [currentUser]);

  // Derived data
  const activeSupplements = supplements.filter(s => s.status === 'active');
  const pausedSupplements = supplements.filter(s => s.status === 'paused');
  const completedSupplements = supplements.filter(s => s.status === 'completed');
  const activeGoals = supplementGoals.filter(g => g.isActive);
  const completedGoals = supplementGoals.filter(g => g.currentProgress >= g.target);
  const inProgressGoals = supplementGoals.filter(g => g.isActive && g.currentProgress < g.target);

  const clearError = useCallback(() => setError(null), []);

  return {
    // Data
    supplements,
    supplementGoals,
    supplementStats,
    loading,
    error,
    
    // Derived data
    activeSupplements,
    pausedSupplements,
    completedSupplements,
    activeGoals,
    completedGoals,
    inProgressGoals,
    
    // Operations
    addSupplement,
    updateSupplementItem,
    removeSupplement,
    addGoal,
    updateGoal,
    removeGoal,
    markSupplementTaken,
    
    // Utilities
    clearError
  };
};