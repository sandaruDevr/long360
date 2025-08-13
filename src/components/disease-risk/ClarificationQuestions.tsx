import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { ClarificationQuestion } from '../../pages/DiseaseRiskPage';

interface ClarificationQuestionsProps {
  questions: ClarificationQuestion[];
  answers: Record<string, any>;
  onAnswerChange: (answers: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const ClarificationQuestions: React.FC<ClarificationQuestionsProps> = ({
  questions,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  isLoading = false
}) => {
  const handleAnswerChange = (questionId: string, answer: any) => {
    const updatedAnswers = { ...answers, [questionId]: answer };
    onAnswerChange(updatedAnswers);
  };

  const getInputComponent = (question: ClarificationQuestion) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="" className="bg-gray-800">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option} className="bg-gray-800">
                {option}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <div className="flex space-x-4">
            <motion.button
              type="button"
              onClick={() => handleAnswerChange(question.id, true)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                value === true
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yes
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleAnswerChange(question.id, false)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                value === false
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              No
            </motion.button>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Your rating</span>
              <span className="text-2xl font-bold text-white">
                {value || question.min || 1}{question.unit || ''}
              </span>
            </div>
            <input
              type="range"
              min={question.min || 1}
              max={question.max || 10}
              value={value || question.min || 1}
              onChange={(e) => handleAnswerChange(question.id, Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{question.min || 1}</span>
              <span>{Math.round(((question.max || 10) + (question.min || 1)) / 2)}</span>
              <span>{question.max || 10}</span>
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Please provide details..."
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        );

      default:
        return null;
    }
  };

  const getRequiredAnsweredCount = () => {
    const requiredQuestions = questions.filter(q => q.required);
    const answeredRequired = requiredQuestions.filter(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== null && answer !== '';
    });
    return { answered: answeredRequired.length, total: requiredQuestions.length };
  };

  const { answered, total } = getRequiredAnsweredCount();
  const canProceed = answered === total;

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

          <h3 className="text-2xl font-bold text-white mb-4">AI is Analyzing Your Profile</h3>
          <p className="text-gray-300">
            Generating personalized clarification questions based on your health data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">AI-Generated Clarification Questions</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Our AI has analyzed your profile and generated personalized questions to improve the accuracy of your risk assessment.
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Question Progress</h3>
          <span className="text-orange-400 font-semibold">{answered}/{total} required completed</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full shadow-inner"
            initial={{ width: 0 }}
            animate={{ width: `${(answered / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all shadow-lg"
          >
            <div className="mb-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-3 leading-relaxed">
                    {question.question}
                    {question.required && <span className="text-red-400 ml-2">*</span>}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  {question.required && (
                    <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                      Required
                    </div>
                  )}
                  {answers[question.id] !== undefined && answers[question.id] !== '' && (
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {getInputComponent(question)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between pt-8 mt-8"
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

        <div className="text-center">
          {!canProceed && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-4 py-2">
              <p className="text-yellow-300 text-sm flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Please complete all required questions to continue</span>
              </p>
            </div>
          )}
        </div>

        <motion.button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center space-x-4 px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: canProceed ? 1.05 : 1 }}
          whileTap={{ scale: canProceed ? 0.95 : 1 }}
        >
          <span>Generate Risk Assessment</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4" />
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
          background: linear-gradient(45deg, #F97316, #EA580C);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #F97316, #EA580C);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ClarificationQuestions;