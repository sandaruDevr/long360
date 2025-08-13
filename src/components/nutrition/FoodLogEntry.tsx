import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Clock, X, Loader, Utensils, Brain } from 'lucide-react';
import { useNutrition } from '../../hooks/useNutrition';
import { FoodItem } from '../../services/nutritionService';
import { format } from 'date-fns';
import { parseNaturalFoodInput } from '../../services/foodParser';

const FoodLogEntry: React.FC = () => {
  const { currentEntry, addFood, removeFood, loading } = useNutrition();
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks' | null>(null);
  const [foodInput, setFoodInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const meals = currentEntry?.meals || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  };

  const dailyTotals = currentEntry?.dailyTotals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snacks': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealColor = (meal: string) => {
    switch (meal) {
      case 'breakfast': return 'from-yellow-500 to-orange-500';
      case 'lunch': return 'from-emerald-500 to-teal-500';
      case 'dinner': return 'from-indigo-500 to-purple-500';
      case 'snacks': return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleAddFood = async () => {
    if (!foodInput.trim() || !activeMeal || isParsing) return;

    setIsParsing(true);
    try {
      const parsedFoods = await parseNaturalFoodInput(foodInput);
      
      for (const food of parsedFoods) {
        const foodItem = {
          name: food.name,
          brand: food.brand,
          quantity: food.quantity,
          unit: food.unit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats,
          fiber: food.fiber,
          sugar: food.sugar,
          sodium: food.sodium,
          micronutrients: food.micronutrients,
          mealType: activeMeal
        };
        
        await addFood(foodItem);
      }
      
      setFoodInput('');
      setActiveMeal(null);
    } catch (error) {
      console.error('Error parsing food input:', error);
      // Show user-friendly error message
      alert('Failed to add food. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemoveFood = async (foodId: string) => {
    try {
      console.log('🗑️ FRONTEND: Starting food removal process');
      console.log('Food ID to remove:', foodId);
      console.log('Current date:', format(new Date(), 'yyyy-MM-dd'));
      
      await removeFood(foodId);
      
      console.log('✅ FRONTEND: Food removal completed successfully');
    } catch (error) {
      console.error('❌ FRONTEND: Error removing food:', error);
      // Show user-friendly error message
      alert('Failed to remove food item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Today's Food Log</h3>
          <p className="text-gray-300">
            {Math.round(dailyTotals.calories)} calories • {Math.round(dailyTotals.protein * 10) / 10}g protein • {format(new Date(), 'EEEE, MMM d')}
          </p>
        </div>
      </div>

      {/* Daily Macros Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{Math.round(dailyTotals.calories)}</div>
          <div className="text-xs text-gray-400">Calories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{Math.round(dailyTotals.protein * 10) / 10}g</div>
          <div className="text-xs text-gray-400">Protein</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{Math.round(dailyTotals.carbs * 10) / 10}g</div>
          <div className="text-xs text-gray-400">Carbs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{Math.round(dailyTotals.fats * 10) / 10}g</div>
          <div className="text-xs text-gray-400">Fats</div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((mealType) => {
          const mealEntries = meals[mealType] || [];
          const mealCalories = mealEntries.reduce((sum, meal) => sum + meal.calories, 0);
          
          return (
            <div key={mealType} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              {/* Meal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getMealIcon(mealType)}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white capitalize">{mealType}</h4>
                    {mealCalories > 0 && (
                      <span className="text-gray-400 text-sm">{mealCalories} kcal</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Food List */}
              <div className="space-y-3 mb-4">
                {mealEntries.length > 0 ? (
                  mealEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/15 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-white text-sm">{entry.name}</h5>
                          <div className="flex items-center space-x-3 mt-1 text-xs">
                            <span className="text-emerald-400">{Math.round(entry.calories)} kcal</span>
                            <span className="text-blue-400">P: {Math.round(entry.protein * 10) / 10}g</span>
                            <span className="text-green-400">C: {Math.round(entry.carbs * 10) / 10}g</span>
                            <span className="text-yellow-400">F: {Math.round(entry.fats * 10) / 10}g</span>
                          </div>
                          <div className="text-gray-400 text-xs mt-1">
                            {entry.quantity}{entry.unit} • {format(new Date(entry.timestamp), 'HH:mm')}
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleRemoveFood(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">{getMealIcon(mealType)}</div>
                    <p className="text-gray-400 text-sm">No foods logged</p>
                  </div>
                )}
              </div>

              {/* Add Food Button */}
              <motion.button
                onClick={() => setActiveMeal(mealType)}
                className={`w-full bg-gradient-to-r ${getMealColor(mealType)} bg-opacity-20 hover:bg-opacity-30 border border-white/20 rounded-lg py-3 text-white font-medium transition-all flex items-center justify-center space-x-2`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Food</span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* AI Food Input Modal */}
      <AnimatePresence>
        {activeMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !isParsing && setActiveMeal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getMealColor(activeMeal)} rounded-xl flex items-center justify-center`}>
                    <span className="text-xl">{getMealIcon(activeMeal)}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white capitalize">Add to {activeMeal}</h4>
                    <p className="text-gray-400 text-sm">Describe what you ate in natural language</p>
                  </div>
                </div>
                
                {!isParsing && (
                  <button
                    onClick={() => setActiveMeal(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* AI-Powered Input */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-semibold text-sm">AI Food Parser</span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    Describe your food naturally: "2 slices of whole wheat toast with avocado" or "large chicken salad with olive oil dressing"
                  </p>
                </div>

                <div className="relative">
                  <textarea
                    value={foodInput}
                    onChange={(e) => setFoodInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddFood())}
                    placeholder="e.g., 1 cup of oatmeal with banana and honey, or grilled chicken breast with rice..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    rows={3}
                    disabled={isParsing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {isParsing ? 'AI is analyzing your food...' : 'Press Enter to send, Shift+Enter for new line'}
                  </div>
                  
                  <motion.button
                    onClick={handleAddFood}
                    disabled={!foodInput.trim() || isParsing}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: foodInput.trim() && !isParsing ? 1.05 : 1 }}
                    whileTap={{ scale: foodInput.trim() && !isParsing ? 0.95 : 1 }}
                  >
                    {isParsing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Parsing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Add Food</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Example Inputs */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs mb-3">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "2 eggs scrambled with cheese",
                    "Large apple with peanut butter",
                    "Grilled salmon with vegetables",
                    "Protein shake with banana"
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setFoodInput(example)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-gray-300 hover:text-white text-xs transition-all"
                      disabled={isParsing}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodLogEntry;