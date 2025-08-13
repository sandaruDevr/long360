import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Volume2, 
  Lightbulb, 
  Bed, 
  Moon, 
  Shield,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { SleepStats, SleepEntry } from '../../types/sleep';

interface EnvironmentFactor {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  inputType: 'number' | 'select' | 'boolean';
  unit?: string;
  current: number | string | boolean;
  optimal: {
    min?: number;
    max?: number;
    value?: string | boolean;
    options?: string[];
  };
  color: string;
}

interface SleepEnvironmentChecklistProps {
  sleepStats?: SleepStats | null;
  latestEntry?: SleepEntry | null;
}

const SleepEnvironmentChecklist: React.FC<SleepEnvironmentChecklistProps> = ({ 
  sleepStats, 
  latestEntry 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [environmentFactors, setEnvironmentFactors] = useState<EnvironmentFactor[]>([
    {
      id: 'temperature',
      name: 'Room Temperature',
      description: 'Optimal temperature for deep sleep and recovery',
      icon: Thermometer,
      inputType: 'number',
      unit: '°F',
      current: 70,
      optimal: { min: 65, max: 68 },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'noise',
      name: 'Noise Level',
      description: 'Ambient noise that could disrupt sleep cycles',
      icon: Volume2,
      inputType: 'select',
      unit: 'dB',
      current: 'Moderate (30-40 dB)',
      optimal: { 
        value: 'Quiet (< 30 dB)',
        options: [
          'Very Quiet (< 20 dB)',
          'Quiet (< 30 dB)', 
          'Moderate (30-40 dB)',
          'Loud (40-50 dB)',
          'Very Loud (> 50 dB)'
        ]
      },
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'lighting',
      name: 'Room Darkness',
      description: 'Light exposure affects melatonin production',
      icon: Lightbulb,
      inputType: 'select',
      current: 'Mostly Dark',
      optimal: { 
        value: 'Complete Darkness',
        options: [
          'Complete Darkness',
          'Mostly Dark',
          'Dim Light',
          'Moderate Light',
          'Bright Light'
        ]
      },
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'mattress',
      name: 'Mattress Quality',
      description: 'Mattress support and comfort level',
      icon: Bed,
      inputType: 'select',
      current: 'Good',
      optimal: { 
        value: 'Excellent',
        options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
      },
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'airQuality',
      name: 'Air Quality',
      description: 'Room ventilation and air freshness',
      icon: Shield,
      inputType: 'boolean',
      current: true,
      optimal: { value: true },
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'humidity',
      name: 'Humidity Level',
      description: 'Optimal humidity for comfortable breathing',
      icon: Moon,
      inputType: 'number',
      unit: '%',
      current: 45,
      optimal: { min: 40, max: 60 },
      color: 'from-indigo-500 to-purple-500'
    }
  ]);

  const isFactorOptimal = (factor: EnvironmentFactor): boolean => {
    if (factor.inputType === 'number' && typeof factor.current === 'number') {
      const { min, max } = factor.optimal;
      if (min !== undefined && max !== undefined) {
        return factor.current >= min && factor.current <= max;
      }
    }
    
    if (factor.inputType === 'select' && typeof factor.current === 'string') {
      return factor.current === factor.optimal.value;
    }
    
    if (factor.inputType === 'boolean' && typeof factor.current === 'boolean') {
      return factor.current === factor.optimal.value;
    }
    
    return false;
  };

  const updateFactor = (factorId: string, newValue: number | string | boolean) => {
    setEnvironmentFactors(prev => 
      prev.map(factor => 
        factor.id === factorId 
          ? { ...factor, current: newValue }
          : factor
      )
    );
    setHasChanges(true);
  };

  const saveChanges = () => {
    setIsEditing(false);
    setHasChanges(false);
    // In production, this would save to backend/localStorage
  };

  const resetChanges = () => {
    // Reset to initial values - in production, this would reload from saved data
    setEnvironmentFactors(prev => prev.map(factor => ({ ...factor })));
    setIsEditing(false);
    setHasChanges(false);
  };

  const getOptimalText = (factor: EnvironmentFactor): string => {
    if (factor.inputType === 'number') {
      const { min, max } = factor.optimal;
      if (min !== undefined && max !== undefined) {
        return `${min}-${max}${factor.unit || ''}`;
      }
    }
    return factor.optimal.value?.toString() || 'Optimal';
  };

  const getCurrentText = (factor: EnvironmentFactor): string => {
    if (factor.inputType === 'boolean') {
      return factor.current ? 'Good' : 'Needs Improvement';
    }
    if (factor.inputType === 'number') {
      return `${factor.current}${factor.unit || ''}`;
    }
    return factor.current.toString();
  };

  const renderInput = (factor: EnvironmentFactor) => {
    switch (factor.inputType) {
      case 'number':
        return (
          <input
            type="number"
            value={factor.current as number}
            onChange={(e) => updateFactor(factor.id, Number(e.target.value))}
            className="w-20 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            min={0}
            max={factor.id === 'temperature' ? 100 : factor.id === 'humidity' ? 100 : 200}
          />
        );
      
      case 'select':
        return (
          <select
            value={factor.current as string}
            onChange={(e) => updateFactor(factor.id, e.target.value)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {factor.optimal.options?.map(option => (
              <option key={option} value={option} className="bg-gray-800">
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <motion.button
            onClick={() => updateFactor(factor.id, !factor.current)}
            className={`w-12 h-6 rounded-full transition-all ${
              factor.current ? 'bg-emerald-500' : 'bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-lg"
              animate={{ x: factor.current ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        );
      
      default:
        return null;
    }
  };

  const optimalCount = environmentFactors.filter(factor => isFactorOptimal(factor)).length;
  const totalCount = environmentFactors.length;
  const optimizationScore = Math.round((optimalCount / totalCount) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 85) return 'Excellent sleep environment!';
    if (score >= 70) return 'Good environment with room for improvement';
    return 'Several areas need optimization';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Sleep Environment</h3>
          <p className="text-gray-300">Optimize your bedroom for better sleep quality</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(optimizationScore)}`}>
              {optimizationScore}%
            </div>
            <div className="text-xs text-gray-400">Optimized</div>
          </div>
          
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg border transition-all ${
              isEditing 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Environment Score Summary */}
      <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-semibold">Environment Assessment</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            optimizationScore >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
            optimizationScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {optimalCount}/{totalCount} Optimal
          </span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${
              optimizationScore >= 85 ? 'from-emerald-500 to-teal-500' :
              optimizationScore >= 70 ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-pink-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${optimizationScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        
        <p className={`text-sm font-medium ${getScoreColor(optimizationScore)}`}>
          {getScoreMessage(optimizationScore)}
        </p>
      </div>

      {/* Environment Factors */}
      <div className="space-y-4">
        {environmentFactors.map((factor, index) => {
          const isOptimal = isFactorOptimal(factor);
          
          return (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                isOptimal ? 'border-emerald-500/30' : 'border-red-500/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${factor.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <factor.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{factor.name}</h4>
                    <div className="flex items-center space-x-2">
                      {isOptimal ? (
                        <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Optimal</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          <span>Needs Attention</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{factor.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-xs font-medium">Current Value</span>
                      <div className="mt-1">
                        {isEditing ? (
                          renderInput(factor)
                        ) : (
                          <div className={`font-semibold ${isOptimal ? 'text-emerald-400' : 'text-red-400'}`}>
                            {getCurrentText(factor)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs font-medium">Optimal Range</span>
                      <div className="mt-1">
                        <div className="text-emerald-400 font-semibold">
                          {getOptimalText(factor)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optimization Tip */}
                  {!isOptimal && (
                    <div className="mt-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                      <div className="flex items-center space-x-2 mb-1">
                        <Info className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400 font-semibold text-xs">Optimization Tip</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {factor.id === 'temperature' && 'Lower your room temperature to 65-68°F using AC, fan, or opening windows.'}
                        {factor.id === 'noise' && 'Use earplugs, white noise machine, or soundproofing to reduce ambient noise.'}
                        {factor.id === 'lighting' && 'Install blackout curtains, use an eye mask, or remove light sources from your bedroom.'}
                        {factor.id === 'mattress' && 'Consider upgrading to a medium-firm mattress that supports your sleep position.'}
                        {factor.id === 'airQuality' && 'Improve ventilation with a fan, air purifier, or by opening windows before sleep.'}
                        {factor.id === 'humidity' && 'Use a humidifier or dehumidifier to maintain 40-60% humidity levels.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-white/10"
          >
            <motion.button
              onClick={resetChanges}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
            
            <motion.button
              onClick={saveChanges}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Environment Impact Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className={`bg-gradient-to-r rounded-xl p-4 border ${
          optimizationScore >= 85 
            ? 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
            : optimizationScore >= 70
            ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
            : 'from-red-500/20 to-pink-500/20 border-red-500/30'
        }`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              optimizationScore >= 85 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : optimizationScore >= 70
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {optimizationScore >= 85 ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <AlertCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <h4 className="text-white font-semibold">Environment Impact</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {optimizationScore >= 85 
              ? 'Your sleep environment is excellently optimized! This setup supports deep, restorative sleep and optimal recovery.'
              : optimizationScore >= 70
              ? `Your environment is good but optimizing the ${totalCount - optimalCount} remaining factor${totalCount - optimalCount > 1 ? 's' : ''} could improve sleep quality by 15-25%.`
              : `Optimizing your sleep environment could significantly improve sleep quality by 30-50%. Focus on the factors marked as needing attention.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SleepEnvironmentChecklist;