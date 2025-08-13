import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Coffee, 
  Cigarette, 
  Moon, 
  Apple, 
  Zap,
  ChevronRight,
  ChevronLeft,
  Target,
  Clock
} from 'lucide-react';
import { LifestyleFactors } from '../../pages/DiseaseRiskPage';

interface LifestyleFormProps {
  lifestyleFactors: LifestyleFactors;
  onLifestyleChange: (factors: LifestyleFactors) => void;
  onNext: () => void;
  onBack: () => void;
}

const LifestyleForm: React.FC<LifestyleFormProps> = ({
  lifestyleFactors,
  onLifestyleChange,
  onNext,
  onBack
}) => {
  const [formData, setFormData] = useState(lifestyleFactors);

  const handleInputChange = (field: keyof LifestyleFactors, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onLifestyleChange(updatedData);
  };

  const toggleDietaryPreference = (preference: string) => {
    const currentPrefs = formData.dietaryPreferences;
    const updatedPrefs = currentPrefs.includes(preference)
      ? currentPrefs.filter(p => p !== preference)
      : [...currentPrefs, preference];
    handleInputChange('dietaryPreferences', updatedPrefs);
  };

  const smokingOptions = [
    { value: 'never', label: 'Never Smoked', icon: '🚭', color: 'from-emerald-500 to-teal-500' },
    { value: 'former', label: 'Former Smoker', icon: '🔄', color: 'from-yellow-500 to-orange-500' },
    { value: 'current-light', label: 'Light Smoker', icon: '🚬', color: 'from-orange-500 to-red-500' },
    { value: 'current-heavy', label: 'Heavy Smoker', icon: '🚬', color: 'from-red-500 to-red-700' }
  ];

  const alcoholOptions = [
    { value: 'none', label: 'No Alcohol', icon: '🚫', color: 'from-emerald-500 to-teal-500' },
    { value: 'light', label: 'Light (1-3/week)', icon: '🍷', color: 'from-blue-500 to-cyan-500' },
    { value: 'moderate', label: 'Moderate (4-7/week)', icon: '🍺', color: 'from-yellow-500 to-orange-500' },
    { value: 'heavy', label: 'Heavy (8+/week)', icon: '🥃', color: 'from-red-500 to-red-700' }
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary', description: 'Mostly sitting, minimal exercise', icon: '🪑', color: 'from-red-500 to-red-600' },
    { value: 'light', label: 'Light Activity', description: 'Some walking, light exercise', icon: '🚶', color: 'from-yellow-500 to-orange-500' },
    { value: 'moderate', label: 'Moderate Activity', description: 'Regular exercise 3-4x/week', icon: '🏃', color: 'from-blue-500 to-cyan-500' },
    { value: 'vigorous', label: 'Vigorous Activity', description: 'Intense exercise 5+x/week', icon: '💪', color: 'from-emerald-500 to-teal-500' }
  ];

  const dietaryOptions = [
    { value: 'high-sugar', label: 'High Sugar', icon: '🍭' },
    { value: 'fast-food', label: 'Frequent Fast Food', icon: '🍔' },
    { value: 'high-protein', label: 'High Protein', icon: '🥩' },
    { value: 'vegan', label: 'Vegan', icon: '🥬' },
    { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { value: 'low-carb', label: 'Low Carb', icon: '🥑' },
    { value: 'processed-foods', label: 'Processed Foods', icon: '📦' },
    { value: 'organic', label: 'Organic', icon: '🌱' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Tell Us About Your Lifestyle</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Your daily habits and lifestyle choices significantly impact your health risks. 
          This information helps us provide more accurate predictions.
        </p>
      </motion.div>

      {/* Smoking Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Cigarette className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-white">Smoking Habits</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smokingOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('smokingStatus', option.value)}
              className={`p-4 rounded-xl border transition-all ${
                formData.smokingStatus === option.value
                  ? 'border-blue-500/50 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-lg`}>
                  {option.icon}
                </div>
                <span className="text-white font-medium">{option.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Alcohol Consumption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Coffee className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-white">Alcohol Consumption</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alcoholOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('alcoholConsumption', option.value)}
              className={`p-4 rounded-xl border transition-all ${
                formData.alcoholConsumption === option.value
                  ? 'border-blue-500/50 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-lg`}>
                  {option.icon}
                </div>
                <span className="text-white font-medium">{option.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Physical Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-white">Physical Activity Level</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activityOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('physicalActivity', option.value)}
              className={`p-4 rounded-xl border transition-all ${
                formData.physicalActivity === option.value
                  ? 'border-blue-500/50 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-lg`}>
                  {option.icon}
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">{option.label}</div>
                  <div className="text-gray-400 text-sm">{option.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sleep and Exercise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Moon className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-bold text-white">Sleep Hours</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Hours per night</span>
              <span className="text-2xl font-bold text-white">{formData.sleepHours}h</span>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              value={formData.sleepHours}
              onChange={(e) => handleInputChange('sleepHours', Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>4h</span>
              <span>8h (Optimal)</span>
              <span>12h</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-bold text-white">Exercise Frequency</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Times per week</span>
              <span className="text-2xl font-bold text-white">{formData.exerciseFrequency}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={formData.exerciseFrequency}
              onChange={(e) => handleInputChange('exerciseFrequency', Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0x</span>
              <span>3-4x (Recommended)</span>
              <span>7x</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stress Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-white">Daily Stress Level</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">How stressed do you feel on average?</span>
            <span className="text-2xl font-bold text-white">{formData.stressLevel}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.stressLevel}
            onChange={(e) => handleInputChange('stressLevel', Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Very Low</span>
            <span>Moderate</span>
            <span>Very High</span>
          </div>
        </div>
      </motion.div>

      {/* Dietary Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Apple className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-bold text-white">Dietary Preferences</h3>
          <span className="text-gray-400 text-sm">(Select all that apply)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dietaryOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => toggleDietaryPreference(option.value)}
              className={`p-3 rounded-xl border transition-all ${
                formData.dietaryPreferences.includes(option.value)
                  ? 'border-emerald-500/50 bg-emerald-500/20'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-xl mb-1">{option.icon}</div>
                <span className="text-white text-sm font-medium">{option.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-between pt-8"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Step</span>
        </motion.button>

        <motion.button
          onClick={onNext}
          className="flex items-center space-x-4 px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Continue to Family History</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </motion.div>

      {/* Custom Styles for Range Sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10B981, #0D9488);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #10B981, #0D9488);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LifestyleForm;