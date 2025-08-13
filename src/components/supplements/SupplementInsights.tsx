import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, ChevronRight, Zap, Sparkles, Loader, RefreshCw } from 'lucide-react';
import { useSupplement } from '../../hooks/useSupplement';
import { getOptimizationTip, analyzeSupplementStack, SupplementOptimizationTip } from '../../services/openaiSupplementService';

const SupplementInsights: React.FC = () => {
  const { supplements, supplementStats, loading } = useSupplement();
  const [optimizationTip, setOptimizationTip] = useState<SupplementOptimizationTip | null>(null);
  const [stackAnalysis, setStackAnalysis] = useState<string>('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const activeSupplements = supplements.filter(s => s.status === 'active');

  // Generate optimization tip when component mounts or stats change
  useEffect(() => {
    if (!supplementStats || loading || activeSupplements.length === 0) return;

    const generateTip = async () => {
      setIsLoadingTip(true);
      
      try {
        const supplementNames = activeSupplements.map(s => s.name);
        const tip = await getOptimizationTip(
          supplementStats.adherenceRate,
          supplementStats.totalCost,
          supplementStats.activeSupplements,
          supplementNames
        );
        setOptimizationTip(tip);
      } catch (error) {
        console.error('Error generating optimization tip:', error);
        // Fallback tip
        setOptimizationTip({
          title: "Track Your Progress",
          description: "Continue tracking your supplements for personalized optimization insights and recommendations.",
          priority: 'medium',
          category: 'general',
          actionable: true
        });
      } finally {
        setIsLoadingTip(false);
      }
    };

    generateTip();
  }, [supplementStats?.adherenceRate, supplementStats?.totalCost, supplementStats?.activeSupplements, loading]);

  // Generate stack analysis when active supplements change
  useEffect(() => {
    if (activeSupplements.length === 0 || loading) {
      setStackAnalysis('');
      return;
    }

    const generateAnalysis = async () => {
      setIsLoadingAnalysis(true);
      
      try {
        const supplementData = activeSupplements.map(s => ({
          name: s.name,
          category: s.category,
          dosage: s.dosage
        }));
        
        const analysis = await analyzeSupplementStack(supplementData);
        setStackAnalysis(analysis);
      } catch (error) {
        console.error('Error generating stack analysis:', error);
        setStackAnalysis('Continue tracking your supplements for personalized stack analysis.');
      } finally {
        setIsLoadingAnalysis(false);
      }
    };

    generateAnalysis();
  }, [activeSupplements.length, loading]);

  const handleRefreshTip = async () => {
    if (!supplementStats || isLoadingTip) return;
    
    setIsLoadingTip(true);
    
    try {
      const supplementNames = activeSupplements.map(s => s.name);
      const tip = await getOptimizationTip(
        supplementStats.adherenceRate,
        supplementStats.totalCost,
        supplementStats.activeSupplements,
        supplementNames
      );
      setOptimizationTip(tip);
    } catch (error) {
      console.error('Error refreshing optimization tip:', error);
      setOptimizationTip({
        title: "Track Your Progress",
        description: "Continue tracking your supplements for personalized optimization insights and recommendations.",
        priority: 'medium',
        category: 'general',
        actionable: true
      });
    } finally {
      setIsLoadingTip(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'adherence': return '📅';
      case 'cost': return '💰';
      case 'timing': return '⏰';
      case 'synergy': return '🔗';
      case 'general': return '💡';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
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
          <h3 className="text-xl font-bold text-white mb-2">Smart Insights</h3>
          <p className="text-gray-300">Intelligent optimization recommendations</p>
        </div>
        
        <motion.button
          onClick={handleRefreshTip}
          disabled={isLoadingTip}
          className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoadingTip ? (
            <Loader className="w-5 h-5 text-purple-400 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5 text-purple-400" />
          )}
        </motion.button>
      </div>

      {/* Optimization Tip */}
      <div className="space-y-6">
        {isLoadingTip ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <Loader className="w-6 h-6 text-purple-400 animate-spin" />
              <div>
                <h4 className="text-white font-semibold">Analyzing Protocol...</h4>
                <p className="text-gray-400 text-sm">Generating personalized insights</p>
              </div>
            </div>
          </div>
        ) : optimizationTip ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                {getCategoryIcon(optimizationTip.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-white">{optimizationTip.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(optimizationTip.priority)}`}>
                    {optimizationTip.priority} priority
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg mb-4">{optimizationTip.description}</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-400 text-sm font-medium capitalize">{optimizationTip.category} optimization</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Stack Analysis */}
        {activeSupplements.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Supplement Stack Analysis</h4>
            {isLoadingAnalysis ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-center space-x-3">
                  <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                  <div>
                    <h5 className="text-white font-semibold">Analyzing Stack...</h5>
                    <p className="text-gray-400 text-sm">Evaluating supplement combinations and synergies</p>
                  </div>
                </div>
              </div>
            ) : stackAnalysis ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold mb-2">Stack Analysis</h5>
                    <p className="text-gray-300 leading-relaxed">{stackAnalysis}</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        )}

        {/* General Insights for Empty State */}
        {activeSupplements.length === 0 && !isLoadingTip && !isLoadingAnalysis && (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Smart Insights Ready</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Start tracking supplements to receive intelligent insights about your protocol, 
                    including optimization tips, stack analysis, and adherence recommendations.
                  </p>
                  <div className="bg-white/10 rounded-lg p-3">
                    <h5 className="text-white font-semibold mb-2">What you'll get:</h5>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span>Personalized optimization tips</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span>Supplement synergy analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span>Adherence improvement strategies</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <span>Cost optimization recommendations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Tips for Getting Started */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h5 className="text-white font-semibold">Foundation Stack</h5>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Start with Vitamin D3, Omega-3, and Magnesium - these three cover the most common deficiencies and work synergistically.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h5 className="text-white font-semibold">Timing Matters</h5>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Take fat-soluble vitamins (A, D, E, K) with meals and water-soluble vitamins (B, C) on an empty stomach for optimal absorption.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-white font-semibold">Supplement Intelligence</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {activeSupplements.length === 0 
              ? "Start tracking your supplements to receive intelligent insights and optimization recommendations."
              : `Tracking ${activeSupplements.length} active supplements. Continue logging adherence for better insights and protocol optimization.`
            }
          </p>
        </div>
      </div>

      {activeSupplements.length > 0 && (
        <div className="mt-4">
          <motion.button
            onClick={handleRefreshTip}
            disabled={isLoadingTip || isLoadingAnalysis}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            whileHover={{ scale: isLoadingTip || isLoadingAnalysis ? 1 : 1.02 }}
            whileTap={{ scale: isLoadingTip || isLoadingAnalysis ? 1 : 0.98 }}
          >
            {isLoadingTip || isLoadingAnalysis ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            <span>{isLoadingTip || isLoadingAnalysis ? 'Generating Insights...' : 'Refresh Insights'}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SupplementInsights;