import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Clock, Users, Star, ChevronRight, Bookmark } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  servings: number;
  calories: number;
  protein: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  image: string;
  rating: number;
}

const mealSuggestions: Recipe[] = [
  {
    id: '1',
    name: 'Mediterranean Quinoa Bowl',
    description: 'Nutrient-dense bowl with quinoa, grilled vegetables, and tahini dressing',
    prepTime: 25,
    servings: 2,
    calories: 420,
    protein: 18,
    difficulty: 'easy',
    tags: ['High Protein', 'Anti-inflammatory', 'Gluten-free'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Omega-3 Rich Salmon',
    description: 'Wild-caught salmon with roasted sweet potato and asparagus',
    prepTime: 30,
    servings: 1,
    calories: 520,
    protein: 42,
    difficulty: 'medium',
    tags: ['Omega-3', 'High Protein', 'Keto-friendly'],
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Antioxidant Smoothie Bowl',
    description: 'Blueberry and spinach smoothie bowl with chia seeds and almonds',
    prepTime: 10,
    servings: 1,
    calories: 280,
    protein: 12,
    difficulty: 'easy',
    tags: ['Antioxidants', 'Quick', 'Vegan'],
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7
  }
];

const MealPlanSuggestions: React.FC = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Meal Suggestions</h3>
          <p className="text-gray-300">AI-curated recipes for your goals</p>
        </div>
        
        <motion.button 
          className="p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChefHat className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {mealSuggestions.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-start space-x-4 p-4">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white truncate">{recipe.name}</h4>
                  <motion.button 
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bookmark className="w-4 h-4" />
                  </motion.button>
                </div>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{recipe.description}</p>

                <div className="flex items-center space-x-4 mb-3 text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>{recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{recipe.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-emerald-400">{recipe.calories} kcal</span>
                    <span className="text-blue-400">{recipe.protein}g protein</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  
                  <motion.button 
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium group-hover:translate-x-1 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    
                   
                  </motion.button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {recipe.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <motion.button 
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white font-medium transition-all flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChefHat className="w-4 h-4" />
          <span>Generate New Meal Plan</span>
        </motion.button>
      </div>
    </div>
  );
};

export default MealPlanSuggestions;