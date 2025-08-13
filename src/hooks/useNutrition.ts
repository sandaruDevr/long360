import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  NutritionEntry,
  FoodItem,
  NutritionGoal,
  MealPlan,
  getNutritionEntry,
  getNutritionEntries,
  addFoodItem,
  removeFoodItem,
  updateHydration,
  getNutritionGoals,
  createNutritionGoal,
  updateNutritionGoal,
  getMealPlans,
  createMealPlan,
  subscribeToNutritionEntry,
  searchFoods,
  calculateDailyTotals,
  calculateMicronutrients,
  calculateWeeklyNutritionScore
} from '../services/nutritionService';
import { format } from 'date-fns';

export const useNutrition = () => {
  const { currentUser } = useAuth();
  const [currentEntry, setCurrentEntry] = useState<NutritionEntry | null>(null);
  const [nutritionHistory, setNutritionHistory] = useState<NutritionEntry[]>([]);
  const [goals, setGoals] = useState<NutritionGoal[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [weeklyNutritionScore, setWeeklyNutritionScore] = useState<number>(0);
  const [weeklyTotals, setWeeklyTotals] = useState<NutritionEntry['dailyTotals']>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Load initial data
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load today's entry
        const todayEntry = await getNutritionEntry(currentUser.uid, today);
        setCurrentEntry(todayEntry);

        // Load nutrition history
        const history = await getNutritionEntries(currentUser.uid, 30);
        setNutritionHistory(history);

        // Load goals
        const userGoals = await getNutritionGoals(currentUser.uid);
        setGoals(userGoals);

        // Load meal plans
        const userMealPlans = await getMealPlans(currentUser.uid);
        setMealPlans(userMealPlans);

      } catch (err) {
        console.error('Error loading nutrition data:', err);
        setError('Failed to load nutrition data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, today]);

  // Subscribe to real-time updates for today's entry
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToNutritionEntry(
      currentUser.uid,
      today,
      (entry) => setCurrentEntry(entry)
    );

    return unsubscribe;
  }, [currentUser, today]);

  // Calculate weekly nutrition score and totals
  useEffect(() => {
    if (nutritionHistory.length === 0) {
      setWeeklyNutritionScore(0);
      setWeeklyTotals({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      });
      return;
    }

    // Get last 7 days of data
    const lastWeekData = nutritionHistory.slice(-7);
    
    // Aggregate weekly totals
    const weeklyAggregated = lastWeekData.reduce((totals, entry) => ({
      calories: totals.calories + (entry.dailyTotals?.calories || 0),
      protein: totals.protein + (entry.dailyTotals?.protein || 0),
      carbs: totals.carbs + (entry.dailyTotals?.carbs || 0),
      fats: totals.fats + (entry.dailyTotals?.fats || 0),
      fiber: totals.fiber + (entry.dailyTotals?.fiber || 0),
      sugar: totals.sugar + (entry.dailyTotals?.sugar || 0),
      sodium: totals.sodium + (entry.dailyTotals?.sodium || 0)
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    });

    // Aggregate weekly micronutrients
    const weeklyMicronutrients = lastWeekData.reduce((micros, entry) => {
      const entryMicros = entry.micronutrients || {};
      return {
        vitaminA: micros.vitaminA + (entryMicros.vitaminA || 0),
        vitaminC: micros.vitaminC + (entryMicros.vitaminC || 0),
        vitaminD: micros.vitaminD + (entryMicros.vitaminD || 0),
        vitaminE: micros.vitaminE + (entryMicros.vitaminE || 0),
        vitaminK: micros.vitaminK + (entryMicros.vitaminK || 0),
        vitaminB6: micros.vitaminB6 + (entryMicros.vitaminB6 || 0),
        vitaminB12: micros.vitaminB12 + (entryMicros.vitaminB12 || 0),
        folate: micros.folate + (entryMicros.folate || 0),
        calcium: micros.calcium + (entryMicros.calcium || 0),
        iron: micros.iron + (entryMicros.iron || 0),
        magnesium: micros.magnesium + (entryMicros.magnesium || 0),
        potassium: micros.potassium + (entryMicros.potassium || 0),
        zinc: micros.zinc + (entryMicros.zinc || 0)
      };
    }, {
      vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0,
      vitaminB6: 0, vitaminB12: 0, folate: 0, calcium: 0, iron: 0,
      magnesium: 0, potassium: 0, zinc: 0
    });

    // Aggregate weekly hydration
    const weeklyHydration = lastWeekData.reduce((hydration, entry) => ({
      waterIntake: hydration.waterIntake + (entry.hydration?.waterIntake || 0),
      target: hydration.target + (entry.hydration?.target || 2.5)
    }), { waterIntake: 0, target: 0 });

    // Calculate weekly nutrition score
    const weeklyScore = calculateWeeklyNutritionScore(
      weeklyAggregated,
      weeklyMicronutrients,
      weeklyHydration,
      lastWeekData.length
    );

    setWeeklyTotals(weeklyAggregated);
    setWeeklyNutritionScore(weeklyScore);
  }, [nutritionHistory]);

  // Food operations
  const addFood = useCallback(async (foodItem: Omit<FoodItem, 'id' | 'timestamp'>) => {
    if (!currentUser) return;

    try {
      await addFoodItem(currentUser.uid, today, foodItem);
      
      // Refresh history after successful add
      try {
        const history = await getNutritionEntries(currentUser.uid, 30);
        setNutritionHistory(history);
      } catch (historyError) {
        console.warn('Failed to refresh nutrition history:', historyError);
      }
    } catch (err) {
      console.error('Error adding food:', err);
      setError('Failed to add food item');
    }
  }, [currentUser, today]);

  const removeFood = useCallback(async (foodId: string) => {
    if (!currentUser) return;

    try {
      console.log('🔄 HOOK: Starting removeFood operation');
      console.log('Parameters:', {
        foodId,
        userId: currentUser.uid,
        date: today
      });
      console.log('Current entry before removal:', currentEntry);
      
      await removeFoodItem(currentUser.uid, today, foodId);
      
      console.log('🔄 HOOK: removeFoodItem completed, refreshing history...');
      
      // Refresh history
      const history = await getNutritionEntries(currentUser.uid, 30);
      setNutritionHistory(history);
      
      console.log('✅ HOOK: Successfully removed food item and refreshed history');
      console.log('New history length:', history.length);
    } catch (err) {
      console.error('❌ HOOK: Error in removeFood:', err);
      setError('Failed to remove food item');
      throw err; // Re-throw to allow component to handle the error
    }
  }, [currentUser, today]);

  // Hydration operations
  const updateWaterIntake = useCallback(async (amount: number) => {
    if (!currentUser) return;

    try {
      await updateHydration(currentUser.uid, today, amount);
    } catch (err) {
      console.error('Error updating hydration:', err);
      setError('Failed to update hydration');
    }
  }, [currentUser, today]);

  // Goal operations
  const addGoal = useCallback(async (goalData: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      await createNutritionGoal(currentUser.uid, goalData);
      
      // Refresh goals
      const userGoals = await getNutritionGoals(currentUser.uid);
      setGoals(userGoals);
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal');
    }
  }, [currentUser]);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<NutritionGoal>) => {
    if (!currentUser) return;

    try {
      await updateNutritionGoal(currentUser.uid, goalId, updates);
      
      // Refresh goals
      const userGoals = await getNutritionGoals(currentUser.uid);
      setGoals(userGoals);
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal');
    }
  }, [currentUser]);

  // Meal plan operations
  const addMealPlan = useCallback(async (planData: Omit<MealPlan, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      await createMealPlan(currentUser.uid, planData);
      
      // Refresh meal plans
      const userMealPlans = await getMealPlans(currentUser.uid);
      setMealPlans(userMealPlans);
    } catch (err) {
      console.error('Error adding meal plan:', err);
      setError('Failed to add meal plan');
    }
  }, [currentUser]);

  // Food search
  const searchFood = useCallback(async (query: string): Promise<FoodItem[]> => {
    try {
      return await searchFoods(query);
    } catch (err) {
      console.error('Error searching foods:', err);
      setError('Failed to search foods');
      return [];
    }
  }, []);

  // Analytics
  const getWeeklyAverage = useCallback((metric: keyof NutritionEntry['dailyTotals']) => {
    const lastWeek = nutritionHistory.slice(-7);
    if (lastWeek.length === 0) return 0;
    
    const total = lastWeek.reduce((sum, entry) => sum + entry.dailyTotals[metric], 0);
    return Math.round(total / lastWeek.length);
  }, [nutritionHistory]);

  const getNutritionTrend = useCallback((metric: keyof NutritionEntry['dailyTotals']) => {
    if (nutritionHistory.length < 2) return 0;
    
    const recent = nutritionHistory.slice(-7);
    const previous = nutritionHistory.slice(-14, -7);
    
    if (recent.length === 0 || previous.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.dailyTotals[metric], 0) / recent.length;
    const previousAvg = previous.reduce((sum, entry) => sum + entry.dailyTotals[metric], 0) / previous.length;
    
    // Prevent division by zero
    if (previousAvg === 0) return recentAvg > 0 ? 100 : 0;
    
    return Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
  }, [nutritionHistory]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // Data
    currentEntry,
    nutritionHistory,
    goals,
    mealPlans,
    weeklyNutritionScore,
    weeklyTotals,
    loading,
    error,
    
    // Operations
    addFood,
    removeFood,
    updateWaterIntake,
    addGoal,
    updateGoal,
    addMealPlan,
    searchFood,
    
    // Analytics
    getWeeklyAverage,
    getNutritionTrend,
    
    // Utilities
    clearError
  };
};