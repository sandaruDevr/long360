import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Plus, Star, ShoppingCart, Info, CheckCircle } from 'lucide-react';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  reason: string;
  benefits: string[];
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedCost: number;
  evidenceLevel: number;
  icon: string;
  color: string;
  isAdded?: boolean;
}

const recommendedSupplements: Supplement[] = [
  {
    id: '1',
    name: 'Vitamin D3 + K2',
    dosage: '4000 IU + 100mcg',
    reason: 'Your genetic profile shows reduced vitamin D synthesis efficiency',
    benefits: ['Bone health', 'Immune function', 'Mood regulation'],
    priority: 'high',
    category: 'Vitamin',
    estimatedCost: 28,
    evidenceLevel: 95,
    icon: '☀️',
    color: 'from-yellow-500 to-orange-500',
    isAdded: false
  },
  {
    id: '2',
    name: 'Omega-3 EPA/DHA',
    dosage: '2000mg',
    reason: 'Low omega-3 index detected in your nutrition analysis',
    benefits: ['Heart health', 'Brain function', 'Anti-inflammatory'],
    priority: 'high',
    category: 'Essential Fatty Acid',
    estimatedCost: 45,
    evidenceLevel: 92,
    icon: '🐟',
    color: 'from-blue-500 to-cyan-500',
    isAdded: false
  },
  {
    id: '3',
    name: 'Magnesium Glycinate',
    dosage: '400mg',
    reason: 'Stress markers suggest magnesium depletion',
    benefits: ['Sleep quality', 'Muscle recovery', 'Stress reduction'],
    priority: 'medium',
    category: 'Mineral',
    estimatedCost: 32,
    evidenceLevel: 88,
    icon: '😴',
    color: 'from-purple-500 to-pink-500',
    isAdded: true
  },
  {
    id: '4',
    name: 'Probiotics Multi-Strain',
    dosage: '50 billion CFU',
    reason: 'Gut microbiome diversity could be enhanced',
    benefits: ['Digestive health', 'Immune support', 'Mental clarity'],
    priority: 'medium',
    category: 'Probiotic',
    estimatedCost: 55,
    evidenceLevel: 85,
    icon: '🦠',
    color: 'from-emerald-500 to-teal-500',
    isAdded: false
  }
];

const SupplementRecommendations: React.FC = () => {
  const [supplements, setSupplements] = useState<Supplement[]>(recommendedSupplements);
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const toggleSupplement = (id: string) => {
    setSupplements(supplements.map(supp => 
      supp.id === id ? { ...supp, isAdded: !supp.isAdded } : supp
    ));
  };

  const totalCost = supplements.filter(s => s.isAdded).reduce((sum, s) => sum + s.estimatedCost, 0);
  const highPriorityCount = supplements.filter(s => s.priority === 'high' && !s.isAdded).length;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Supplement Recommendations</h3>
          <p className="text-gray-300">AI-curated based on your nutrition analysis</p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">${totalCost}</div>
          <div className="text-xs text-gray-400">Monthly Cost</div>
        </div>
      </div>

      {/* Priority Alert */}
      {highPriorityCount > 0 && (
        <div className="mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">High Priority Recommendations</h4>
              <p className="text-gray-300 text-sm">
                {highPriorityCount} supplement{highPriorityCount > 1 ? 's' : ''} identified as high priority based on your genetic and nutrition analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Supplement Cards */}
      <div className="space-y-4">
        {supplements.map((supplement, index) => (
          <motion.div
            key={supplement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border transition-all hover:bg-white/10 ${
              supplement.isAdded ? 'border-emerald-500/30' : 'border-white/10'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-14 h-14 bg-gradient-to-r ${supplement.color} rounded-xl flex items-center justify-center flex-shrink-0 text-2xl`}>
                {supplement.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-semibold text-white">{supplement.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(supplement.priority)}`}>
                        {supplement.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{supplement.dosage} • {supplement.category}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-white font-semibold">${supplement.estimatedCost}/mo</div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-xs">{supplement.evidenceLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{supplement.reason}</p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {supplement.benefits.map((benefit, benefitIndex) => (
                    <span
                      key={benefitIndex}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={() => setExpandedSupplement(
                      expandedSupplement === supplement.id ? null : supplement.id
                    )}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    {expandedSupplement === supplement.id ? 'Hide Details' : 'View Details'}
                  </motion.button>

                  <div className="flex items-center space-x-2">
                    {supplement.isAdded ? (
                      <motion.button
                        onClick={() => toggleSupplement(supplement.id)}
                        className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Added</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => toggleSupplement(supplement.id)}
                        className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Protocol</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedSupplement === supplement.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-white font-semibold mb-2">Recommended Timing</h5>
                          <p className="text-gray-300 text-sm">
                            {supplement.name.includes('D3') && 'Take with breakfast for optimal absorption'}
                            {supplement.name.includes('Omega-3') && 'Take with meals to reduce fishy aftertaste'}
                            {supplement.name.includes('Magnesium') && 'Take 1-2 hours before bedtime'}
                            {supplement.name.includes('Probiotics') && 'Take on empty stomach, 30 min before meals'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white font-semibold mb-2">Quality Considerations</h5>
                          <p className="text-gray-300 text-sm">
                            {supplement.name.includes('D3') && 'Look for D3 with K2, third-party tested'}
                            {supplement.name.includes('Omega-3') && 'Choose molecularly distilled, high EPA/DHA ratio'}
                            {supplement.name.includes('Magnesium') && 'Glycinate form for better absorption and less GI upset'}
                            {supplement.name.includes('Probiotics') && 'Multi-strain formula with enteric coating'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{supplements.filter(s => s.isAdded).length}</div>
            <div className="text-xs text-gray-400">Added to Protocol</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">${totalCost}</div>
            <div className="text-xs text-gray-400">Monthly Investment</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-400">
              {Math.round(supplements.filter(s => s.isAdded).reduce((sum, s) => sum + s.evidenceLevel, 0) / Math.max(supplements.filter(s => s.isAdded).length, 1))}%
            </div>
            <div className="text-xs text-gray-400">Evidence Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementRecommendations;