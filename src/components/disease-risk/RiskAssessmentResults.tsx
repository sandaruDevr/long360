// src/components/disease-risk/RiskAssessmentResults.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Heart,
  Activity,
  Target,
  TrendingUp,
  Download,
  Share2,
  Bookmark,
  RefreshCw,
  Info,
  Loader,
  Sparkles
} from 'lucide-react';
import { RiskAssessment } from '../../pages/DiseaseRiskPage';

interface RiskAssessmentResultsProps {
  assessment: RiskAssessment | null;
  onStartOver: () => void;
  isLoading?: boolean;
}

const RiskAssessmentResults: React.FC<RiskAssessmentResultsProps> = ({
  assessment,
  onStartOver,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'recommendations'>('overview');

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-600 to-red-700';
      case 'moderate': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'moderate': return Clock;
      case 'low': return CheckCircle;
      default: return Clock;
    }
  };

  const getOverallRiskLevel = (score: number) => {
    if (score <= 20) return { level: 'Low Risk', color: 'text-emerald-400', bgColor: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/30' };
    if (score <= 40) return { level: 'Moderate Risk', color: 'text-yellow-400', bgColor: 'from-yellow-500/20 to-orange-500/20', borderColor: 'border-yellow-500/30' };
    if (score <= 60) return { level: 'Elevated Risk', color: 'text-orange-400', bgColor: 'from-orange-500/20 to-red-500/20', borderColor: 'border-orange-500/30' };
    return { level: 'High Risk', color: 'text-red-400', bgColor: 'from-red-500/20 to-red-600/20', borderColor: 'border-red-500/30' };
  };

  // Calculate overall risk level when assessment is available
  const overallRisk = assessment ? getOverallRiskLevel(assessment.overallRiskScore) : null;

  // Loading steps for the enhanced popup
  const loadingSteps = [
    "Analyzing personal information...",
    "Evaluating lifestyle factors...",
    "Processing family medical history...",
    "Cross-referencing with AI knowledge base...",
    "Generating personalized risk predictions...",
    "Formulating prevention strategies...",
    "Finalizing comprehensive report..."
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
                    <motion.div
            animate={{
              scale: [1, 1.1, 1], // Subtle expand and contract
              opacity: [0.8, 1, 0.8], // Subtle fade in and out
              y: [0, -5, 0] // Subtle vertical float
            }}
            transition={{
              duration: 2, // Duration of one animation cycle
              repeat: Infinity, // Loop indefinitely
              ease: "easeInOut" // Smooth start and end
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-4">AI is Generating Your Risk Assessment</h3>
          <p className="text-gray-300">
            This comprehensive analysis typically takes 30-60 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Disease Risk Assessment</h2>
        <p className="text-gray-300 text-lg">AI-powered analysis based on your complete health profile</p>
      </motion.div>

      {/* Overall Risk Score */}
      {overallRisk && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-r ${overallRisk.bgColor} backdrop-blur-sm rounded-2xl p-8 border ${overallRisk.borderColor} shadow-xl`}
        >
          <div className="flex items-center space-x-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${getPriorityColor(assessment.overallRiskScore <= 20 ? 'low' : assessment.overallRiskScore <= 40 ? 'moderate' : 'high')} rounded-2xl flex items-center justify-center shadow-lg`}>
              {React.createElement(getPriorityIcon(assessment.overallRiskScore <= 20 ? 'low' : assessment.overallRiskScore <= 40 ? 'moderate' : 'high'), { className: "w-8 h-8 text-white" })}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Overall Health Risk</h3>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{assessment.overallRiskScore}%</div>
                    <div className="text-xs text-gray-300">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{assessment.confidenceScore}%</div>
                    <div className="text-xs text-gray-300">AI Confidence</div>
                  </div>
                </div>
              </div>
              <p className={`text-xl font-semibold ${overallRisk.color} mb-4`}>{overallRisk.level}</p>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <Brain className="w-4 h-4" />
                <span className="text-sm">Evidence-Based Predictions</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-2"
      >
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'overview', label: 'Risk Overview', icon: Shield },
            { id: 'detailed', label: 'Detailed Analysis', icon: Activity },
            { id: 'recommendations', label: 'Recommendations', icon: Target }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:block">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Risk Factors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessment.riskFactors.map((risk, index) => (
                <motion.div
                  key={risk.condition}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${getPriorityColor(risk.severity)}/20 backdrop-blur-sm rounded-xl p-6 border ${getPriorityColor(risk.severity).replace('from-', 'border-').replace('-600', '-500/30').replace('-700', '-500/30').replace('to-red-700', '').replace('to-orange-500', '').replace('to-teal-500', '').replace('to-gray-600', '')}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getPriorityColor(risk.severity)} rounded-xl flex items-center justify-center shadow-lg`}>
                      {React.createElement(getPriorityIcon(risk.severity), { className: "w-6 h-6 text-white" })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-white">{risk.condition}</h4>
                        <span className="text-2xl font-bold text-white">{risk.riskPercentage}%</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">{risk.explanation}</p>
                      <div className="space-y-1">
                        {risk.preventionTips.slice(0, 2).map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <span className="text-gray-300 text-xs">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'detailed' && (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {assessment.riskFactors.map((risk, index) => (
              <motion.div
                key={risk.condition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getPriorityColor(risk.severity)} rounded-xl flex items-center justify-center shadow-lg`}>
                    {React.createElement(getPriorityIcon(risk.severity), { className: "w-6 h-6 text-white" })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">{risk.condition}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{risk.riskPercentage}%</div>
                        <div className="text-xs text-gray-400">Risk Level</div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 leading-relaxed">{risk.explanation}</p>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-3">Prevention Strategies</h5>
                      <div className="space-y-2">
                        {risk.preventionTips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Lifestyle Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white">Lifestyle Changes</h4>
              </div>
              <div className="space-y-3">
                {assessment.recommendations.lifestyle.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Medical Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white">Medical Care</h4>
              </div>
              <div className="space-y-3">
                {assessment.recommendations.medical.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Monitoring Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white">Monitoring</h4>
              </div>
              <div className="space-y-3">
                {assessment.recommendations.monitoring.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

     
     
      {/* Enhanced Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30"
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Important Medical Disclaimer</h4>
            <p className="text-yellow-200 leading-relaxed">
              This AI-powered risk assessment is for informational and educational purposes only. It should not replace professional medical advice,
              diagnosis, or treatment. Please consult with qualified healthcare providers for personalized medical guidance.
              In case of emergency, call 911 or visit your nearest emergency room immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskAssessmentResults;
