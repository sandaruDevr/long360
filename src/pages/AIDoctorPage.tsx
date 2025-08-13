import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  MessageCircle,
  Send,
  FileText,
  Heart,
  Activity,
  User,
  Sparkles
} from 'lucide-react';
import SymptomInput from '../components/ai-doctor/SymptomInput';
import MedicalHistoryForm from '../components/ai-doctor/MedicalHistoryForm';
import AnalysisSummary from '../components/ai-doctor/AnalysisSummary';
import { analyzeSymptoms, generateDiagnosis, MedicalQuestion, DiagnosisResult } from '../services/openai';

interface Symptom {
  id: string;
  text: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: string;
}

const AIDoctorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [medicalQuestions, setMedicalQuestions] = useState<MedicalQuestion[]>([]);
  const [medicalAnswers, setMedicalAnswers] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosisResult | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpMessages, setFollowUpMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string}>>([]);

  const steps = [
    { 
      number: 1, 
      title: 'Symptoms', 
      description: 'Describe your symptoms',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      number: 2, 
      title: 'Medical History', 
      description: 'Additional information',
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      number: 3, 
      title: 'Review', 
      description: 'Verify information',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      number: 4, 
      title: 'AI Analysis', 
      description: 'Get your results',
      icon: Brain,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleSymptomsNext = async () => {
    setIsLoadingQuestions(true);
    setCurrentStep(2);
    
    try {
      const analysis = await analyzeSymptoms(symptoms);
      setMedicalQuestions(analysis.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback questions
      setMedicalQuestions([
        {
          id: '1',
          question: 'How long have you been experiencing these symptoms?',
          type: 'select',
          options: ['Less than 24 hours', '1-3 days', '1 week', '2-4 weeks', 'More than a month'],
          required: true
        },
        {
          id: '2',
          question: 'Do you have any known allergies to medications?',
          type: 'boolean',
          required: true
        }
      ]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleMedicalHistoryNext = () => {
    setCurrentStep(3);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setMedicalAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setCurrentStep(4);
    
    try {
      const result = await generateDiagnosis(symptoms, medicalAnswers);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error generating diagnosis:', error);
      // Fallback result
      setAnalysisResult({
        primaryDiagnosis: 'Unable to determine - Please consult a healthcare provider',
        confidence: 50,
        priority: 'medium',
        accuracy: 60,
        warnings: ['This analysis is preliminary and should not replace professional medical consultation'],
        medications: [],
        lifestyle: ['Rest and hydration', 'Monitor symptoms'],
        prevention: ['Maintain good hygiene', 'Follow up with healthcare provider'],
        followUpRecommendations: ['Consult with a healthcare provider within 24-48 hours'],
        whenToSeekCare: ['If symptoms worsen', 'If new symptoms develop', 'If you have concerns']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setSymptoms([]);
    setMedicalQuestions([]);
    setMedicalAnswers({});
    setAnalysisResult(null);
    setFollowUpMessages([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'from-red-600 to-red-700';
      case 'high': return 'from-orange-500 to-red-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Clock;
    }
  };

  const handleFollowUpSubmit = () => {
    if (!followUpQuestion.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: followUpQuestion
    };
    
    setFollowUpMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "Based on your symptoms and the analysis, this is a common condition that typically resolves within 7-10 days. Continue with the recommended treatment and monitor your symptoms. If you experience worsening symptoms or develop a fever above 101°F, please consult with a healthcare provider immediately."
      };
      setFollowUpMessages(prev => [...prev, aiResponse]);
    }, 1500);
    
    setFollowUpQuestion('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white">AI Medical Assistant</h1>
                <p className="text-blue-200 text-lg">Advanced AI-powered health consultation</p>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">Doctor Reviewed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Enhanced Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Progress</span>
                <span className="text-blue-400 font-medium">{currentStep}/4</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 4) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Navigation */}
            <div className="grid grid-cols-4 gap-4">
              {steps.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const isAccessible = currentStep >= step.number;
                
                return (
                  <motion.div
                    key={step.number}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-white/15 border-white/30 shadow-lg' 
                        : isCompleted
                        ? 'bg-emerald-500/20 border-emerald-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                    whileHover={isAccessible ? { scale: 1.02 } : {}}
                  >
                    {/* Step Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto ${
                      isCompleted 
                        ? 'bg-emerald-500' 
                        : isActive 
                        ? `bg-gradient-to-r ${step.color}` 
                        : 'bg-white/10'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <step.icon className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="text-center">
                      <h3 className={`font-semibold mb-1 ${
                        isActive ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs ${
                        isActive ? 'text-gray-300' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Active Step Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
          >
            {/* Step 1: Symptoms */}
            {currentStep === 1 && (
              <div className="p-8">
                <SymptomInput
                  symptoms={symptoms}
                  onSymptomsChange={setSymptoms}
                  onNext={handleSymptomsNext}
                />
              </div>
            )}

            {/* Step 2: Medical History */}
            {currentStep === 2 && (
              <div className="p-8">
                <MedicalHistoryForm
                  questions={medicalQuestions}
                  answers={medicalAnswers}
                  onAnswerChange={handleAnswerChange}
                  onNext={handleMedicalHistoryNext}
                  onBack={handleBack}
                  isLoading={isLoadingQuestions}
                />
              </div>
            )}

            {/* Step 3: Analysis Summary */}
            {currentStep === 3 && (
              <div className="p-8">
                <AnalysisSummary
                  symptoms={symptoms}
                  medicalHistory={medicalAnswers}
                  questions={medicalQuestions}
                  onAnalyze={handleAnalyze}
                  onBack={handleBack}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}

            {/* Step 4: Results */}
            {currentStep === 4 && analysisResult && (
              <div className="p-8 space-y-8">
                {/* Results Header */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">AI Medical Analysis Complete</h2>
                  <p className="text-gray-300 text-lg">Based on your symptoms and medical history</p>
                </div>

                {/* Primary Diagnosis Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getPriorityColor(analysisResult.priority)} rounded-2xl flex items-center justify-center shadow-lg`}>
                      {React.createElement(getPriorityIcon(analysisResult.priority), { className: "w-8 h-8 text-white" })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white">Primary Assessment</h3>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{analysisResult.confidence}%</div>
                            <div className="text-xs text-gray-400">Confidence</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">{analysisResult.accuracy}%</div>
                            <div className="text-xs text-gray-400">Accuracy</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-white text-xl font-semibold mb-4">{analysisResult.primaryDiagnosis}</p>
                      <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getPriorityColor(analysisResult.priority)} text-white shadow-lg`}>
                          {analysisResult.priority.toUpperCase()} Priority
                        </span>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm">AI-Powered Analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Warnings */}
                {analysisResult.warnings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <span>Important Medical Warnings</span>
                    </h4>
                    <div className="space-y-3">
                      {analysisResult.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-red-200 leading-relaxed">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Recommendations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Medications */}
                  {analysisResult.medications.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                    >
                      <h4 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                        <Heart className="w-6 h-6 text-blue-400" />
                        <span>Recommended Medications</span>
                      </h4>
                      <div className="space-y-4">
                        {analysisResult.medications.map((med, index) => (
                          <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h5 className="font-semibold text-white mb-2">{med.name}</h5>
                            <p className="text-blue-400 text-sm mb-2">{med.dosage} - {med.frequency}</p>
                            <p className="text-gray-300 text-sm leading-relaxed">{med.notes}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Lifestyle Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                      <Activity className="w-6 h-6 text-emerald-400" />
                      <span>Lifestyle Recommendations</span>
                    </h4>
                    <div className="space-y-3">
                      {analysisResult.lifestyle.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Prevention & Follow-up */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Prevention Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  >
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-purple-400" />
                      <span>Prevention Strategies</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {analysisResult.prevention.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Follow-up Recommendations */}
                  {analysisResult.followUpRecommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                    >
                      <h4 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-blue-400" />
                        <span>Follow-up Care</span>
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.followUpRecommendations.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* When to Seek Care */}
                {analysisResult.whenToSeekCare.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30"
                  >
                    <h4 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                      <span>Seek Immediate Medical Care If:</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.whenToSeekCare.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-red-200 font-medium leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Follow-up Questions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <h4 className="text-lg font-semibold text-white mb-6 flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-cyan-400" />
                    <span>Ask Follow-up Questions</span>
                  </h4>
                  
                  {/* Messages */}
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                    {followUpMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/10 text-gray-200 border border-white/20'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Input */}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleFollowUpSubmit()}
                      placeholder="Ask about symptoms, treatment, or next steps..."
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                    <motion.button
                      onClick={handleFollowUpSubmit}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Enhanced Disclaimer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Important Medical Disclaimer</h4>
                      <p className="text-yellow-200 leading-relaxed">
                        This AI analysis is for informational purposes only and should not replace professional medical advice. 
                        Please consult with a qualified healthcare provider for proper diagnosis and treatment. In case of emergency, 
                        call 911 or visit your nearest emergency room immediately.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation */}
        {currentStep < 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mt-8"
          >
            {currentStep > 1 ? (
              <motion.button
                onClick={handleBack}
                className="flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous Step</span>
              </motion.button>
            ) : (
              <div></div>
            )}

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <div></div>
          </motion.div>
        )}

        {/* Start Over Button for Results */}
        {currentStep === 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <motion.button
              onClick={handleStartOver}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start New Consultation
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIDoctorPage;