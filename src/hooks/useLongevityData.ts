import { useState, useEffect, useMemo } from 'react';
import { useSleep } from './useSleep';
import { useWorkout } from './useWorkout';
import { useNutrition } from './useNutrition';
import { useSupplement } from './useSupplement';

interface LongevityMetrics {
  longevityScore: number;
  biologicalAge: number;
  healthspan: number;
  vitalityIndex: number;
  loading: boolean;
}

const calculateLongevityMetrics = (
  sleepStats: any,
  workoutStats: any,
  nutritionStats: any,
  supplementStats: any
): Omit<LongevityMetrics, 'loading'> => {
  // Default values if stats are not yet loaded or available
  const defaultSleepScore = 70;
  const defaultWorkoutConsistency = 70;
  const defaultNutritionScore = 70;
  const defaultSupplementScore = 70;

  const avgSleepScore = sleepStats?.averageSleepScore || defaultSleepScore;
  const workoutConsistency = workoutStats?.consistency || defaultWorkoutConsistency;
  const weeklyNutritionScore = nutritionStats?.weeklyNutritionScore || defaultNutritionScore;
  const supplementOptimizationScore = supplementStats?.supplementScore || defaultSupplementScore;

  // --- Longevity Score Algorithm (Weighted Average) ---
  // Weights: Sleep (0.3), Workout (0.3), Nutrition (0.3), Supplements (0.1)
  // Scores are out of 100, normalize to 0-10 scale for final longevity score
  const longevityScoreRaw = (
    (avgSleepScore * 0.3) +
    (workoutConsistency * 0.3) +
    (weeklyNutritionScore * 0.3) +
    (supplementOptimizationScore * 0.1)
  );
  const longevityScore = parseFloat((longevityScoreRaw / 10).toFixed(1)); // Scale to 0-10 and one decimal place

  // Ensure score is within 0-10 range
  const finalLongevityScore = Math.max(0, Math.min(10, longevityScore));

  // --- Biological Age Calculation ---
  // Assumed chronological age for the demo
  const chronologicalAge = 35;
  // Scaling factor: For every 1 point above/below 7.0, adjust biological age by 2 years
  const biologicalAgeAdjustment = (finalLongevityScore - 7.0) * 2;
  const biologicalAge = parseFloat((chronologicalAge - biologicalAgeAdjustment).toFixed(1));
  // Ensure biological age is reasonable (e.g., not negative or excessively high)
  const finalBiologicalAge = Math.max(20, Math.min(chronologicalAge + 10, biologicalAge));

  // --- Healthspan Calculation ---
  // Assumed base healthspan for the demo
  const baseHealthspan = 80;
  // Scaling factor: For every 1 point above/below 7.0, adjust healthspan by 5 years
  const healthspanAdjustment = (finalLongevityScore - 7.0) * 5;
  const healthspan = parseFloat((baseHealthspan + healthspanAdjustment).toFixed(1));
  // Ensure healthspan is reasonable
  const finalHealthspan = Math.max(70, Math.min(100, healthspan));

  // --- Vitality Index Calculation ---
  // Simple average of key performance indicators
  const vitalityIndexRaw = (
    (avgSleepScore * 0.25) +
    (workoutConsistency * 0.25) +
    (weeklyNutritionScore * 0.25) +
    (supplementOptimizationScore * 0.25)
  );
  const vitalityIndex = parseFloat(vitalityIndexRaw.toFixed(0)); // Round to nearest whole number
  const finalVitalityIndex = Math.max(0, Math.min(100, vitalityIndex));

  return {
    longevityScore: finalLongevityScore,
    biologicalAge: finalBiologicalAge,
    healthspan: finalHealthspan,
    vitalityIndex: finalVitalityIndex,
  };
};

export const useLongevityData = (): LongevityMetrics => {
  const { sleepStats, loading: sleepLoading } = useSleep();
  const { workoutStats, loading: workoutLoading } = useWorkout();
  const { weeklyNutritionScore, loading: nutritionLoading } = useNutrition();
  const { supplementStats, loading: supplementLoading } = useSupplement();

  const loading = sleepLoading || workoutLoading || nutritionLoading || supplementLoading;

  const metrics = useMemo(() => {
    if (loading) {
      // Return default/placeholder metrics while loading
      return {
        longevityScore: 7.0,
        biologicalAge: 35.0,
        healthspan: 80.0,
        vitalityIndex: 75,
      };
    }
    return calculateLongevityMetrics(
      sleepStats,
      workoutStats,
      { weeklyNutritionScore }, // Pass as object to match expected structure
      supplementStats
    );
  }, [
    loading,
    sleepStats,
    workoutStats,
    weeklyNutritionScore,
    supplementStats,
  ]);

  return { ...metrics, loading };
};