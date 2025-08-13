import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  FileText, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface Symptom {
  id: string;
  text: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: string;
}

interface AnalysisSummaryProps {
  symptoms: Symptom[];
  medicalHistory: Record<string, any>;
  questions: Array<{ id: string; question: string; type: string }>;
  onAnalyze: () => void;
  onBack: () => void;
  isAnalyzing?: boolean;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  symptoms,
  medicalHistory,
  questions,
  onAnalyze,
  onBack,
  isAnalyzing = false
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-emerald-400 bg-emerald-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'severe': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatAnswer = (answer: any, questionType: string) => {
    if (answer === null || answer === undefined || answer === '') {
      return 'Not provided';
    }
    
    if (typeof answer === 'boolean') {
      return answer ? 'Yes' : 'No';
    }
    
    if (Array.isArray(answer)) {
      return answer.length > 0 ? answer.join(', ') : 'None selected';
    }
    
    return answer.toString();
  };

  const answeredQuestions = questions.filter(q => {
    const answer = medicalHistory[q.id];
    return answer !== undefined && answer !== null && answer !== '';
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Review Your Information</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Please review your information carefully before our AI provides a comprehensive medical analysis. 
          You can go back to make changes if needed.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Symptoms Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-lg"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Your Symptoms</h3>
              <p className="text-gray-300 text-lg">{symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} reported</p>
            </div>
          </div>

          <div className="space-y-4">
            {symptoms.map((symptom, index) => (
              <motion.div
                key={symptom.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-white text-lg">{symptom.text}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                    {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 font-medium">Duration:</span>
                    <span className="text-white ml-2 font-semibold">{symptom.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Frequency:</span>
                    <span className="text-white ml-2 font-semibold">{symptom.frequency}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Medical History Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-bl from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-lg"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Medical Information</h3>
              <p className="text-gray-300 text-lg">{answeredQuestions.length} question{answeredQuestions.length !== 1 ? 's' : ''} answered</p>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {answeredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
              >
                <h5 className="text-white font-semibold mb-2 leading-relaxed">{question.question}</h5>
                <p className="text-gray-300">
                  {formatAnswer(medicalHistory[question.id], question.type)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Quality Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-lg"
      >
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Analysis Readiness Check</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-bold mb-2">Symptoms</h4>
            <p className="text-emerald-400 text-2xl font-bold">{symptoms.length}</p>
            <p className="text-gray-400">Detailed symptoms provided</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-bold mb-2">Medical History</h4>
            <p className="text-blue-400 text-2xl font-bold">{answeredQuestions.length}</p>
            <p className="text-gray-400">Questions answered</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-bold mb-2">AI Confidence</h4>
            <p className="text-purple-400 text-2xl font-bold">High</p>
            <p className="text-gray-400">Analysis accuracy</p>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-8 border border-emerald-500/30 shadow-lg"
      >
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready for Advanced AI Analysis</h3>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              Our state-of-the-art medical AI will analyze your symptoms and medical history to provide:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-200 font-medium">Preliminary diagnosis assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-200 font-medium">Treatment recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-200 font-medium">Lifestyle modifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-200 font-medium">When to seek professional care</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-8 mt-8"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Step</span>
        </motion.button>

        <motion.button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center space-x-4 px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
          whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-6 h-6" />
              </motion.div>
              <span>AI is Analyzing...</span>
            </>
          ) : (
            <>
              <Brain className="w-6 h-6" />
              <span>Start AI Analysis</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
                <Sparkles className="w-4 h-4" />
              </div>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl p-8 border border-emerald-500/30 shadow-lg mt-8"
        >
          <div className="text-center">
            <h4 className="text-2xl font-bold text-white mb-4">AI Medical Analysis in Progress</h4>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed">
              Our advanced medical AI is carefully analyzing your symptoms and medical history. 
              This comprehensive analysis typically takes 30-60 seconds to ensure accuracy.
            </p>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 bg-emerald-400 rounded-full"
                />
                <span className="text-gray-300 font-medium">Processing symptoms</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  className="w-4 h-4 bg-teal-400 rounded-full"
                />
                <span className="text-gray-300 font-medium">Analyzing medical history</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                  className="w-4 h-4 bg-blue-400 rounded-full"
                />
                <span className="text-gray-300 font-medium">Generating recommendations</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalysisSummary;