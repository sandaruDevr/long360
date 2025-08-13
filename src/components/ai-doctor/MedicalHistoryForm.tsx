import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Info,
  Clock,
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MedicalQuestion } from '../../services/openai';

interface MedicalHistoryFormProps {
  questions: MedicalQuestion[];
  answers: Record<string, any>;
  onAnswerChange: (questionId: string, answer: any) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  questions,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  isLoading = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  const handleFileUpload = (questionId: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [questionId]: file }));
    onAnswerChange(questionId, file.name);
  };

  const getInputComponent = (question: MedicalQuestion) => {
    const value = answers[question.id];

    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder || 'Please provide details...'}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
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
              onClick={() => onAnswerChange(question.id, true)}
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
              onClick={() => onAnswerChange(question.id, false)}
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

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder || 'Enter a number...'}
            min={question.validation?.min}
            max={question.validation?.max}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selectedOptions = value || [];
              const isSelected = selectedOptions.includes(option);
              
              return (
                <motion.label
                  key={option}
                  className="flex items-center space-x-3 cursor-pointer group"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-white/30 group-hover:border-white/50'
                  }`}>
                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-white group-hover:text-gray-200 transition-colors">
                    {option}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newSelection = e.target.checked
                        ? [...selectedOptions, option]
                        : selectedOptions.filter((item: string) => item !== option);
                      onAnswerChange(question.id, newSelection);
                    }}
                    className="sr-only"
                  />
                </motion.label>
              );
            })}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-2">Upload Medical Image</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {question.imageGuidance || 'Upload a clear photo of the affected area'}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <motion.label
                    className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-3 rounded-xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(question.id, file);
                      }}
                      className="sr-only"
                    />
                  </motion.label>
                  
                  <motion.label
                    className="flex items-center space-x-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(question.id, file);
                      }}
                      className="sr-only"
                    />
                  </motion.label>
                </div>
              </div>
            </div>
            
            {uploadedFiles[question.id] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    File uploaded: {uploadedFiles[question.id].name}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
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
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-4">AI is Analyzing Your Symptoms</h3>
          <p className="text-gray-300">
            Generating personalized medical history questions based on your symptoms...
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
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Medical History Questions</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Our AI has generated personalized questions based on your symptoms. 
          Your answers help us provide the most accurate medical analysis.
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
          <span className="text-purple-400 font-semibold">{answered}/{total} required completed</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full shadow-inner"
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-3 leading-relaxed">
                    {question.question}
                    {question.required && <span className="text-red-400 ml-2">*</span>}
                  </h4>
                  {question.guidance && (
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <p className="text-purple-200 leading-relaxed">{question.guidance}</p>
                      </div>
                    </div>
                  )}
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
          className="flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all shadow-lg"
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
          className="flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: canProceed ? 1.02 : 1 }}
          whileTap={{ scale: canProceed ? 0.98 : 1 }}
        >
          <span>Continue to Review</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MedicalHistoryForm;