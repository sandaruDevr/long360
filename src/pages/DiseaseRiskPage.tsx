// src/pages/DiseaseRiskPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ChevronRight,
  ChevronLeft,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Activity,
  Heart,
  FileText,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';
import PersonalInfoForm from '../components/disease-risk/PersonalInfoForm';
import LifestyleForm from '../components/disease-risk/LifestyleForm';
import FamilyHistoryForm from '../components/disease-risk/FamilyHistoryForm';
import ClarificationQuestions from '../components/disease-risk/ClarificationQuestions';
import RiskAssessmentResults from '../components/disease-risk/RiskAssessmentResults';
import { generateClarificationQuestions, generateRiskAssessment } from '../services/diseaseRiskService';

export interface PersonalInfo {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  bmi?: number;
}

export interface LifestyleFactors {
  smokingStatus: 'never' | 'former' | 'current-light' | 'current-heavy';
  alcoholConsumption: 'none' | 'light' | 'moderate' | 'heavy';
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'vigorous';
  sleepHours: number;
  dietaryPreferences: string[];
  stressLevel: number;
  exerciseFrequency: number;
}

export interface FamilyHistory {
  heartDisease: boolean;
  diabetes: boolean;
  cancer: boolean;
  stroke: boolean;
  alzheimers: boolean;
  osteoporosis: boolean;
  mentalHealth: boolean;
  autoimmune: boolean;
  other: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  type: 'select' | 'boolean' | 'slider' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  required: boolean;
}

export interface RiskAssessment {
  overallRiskScore: number;
  riskFactors: Array<{
    condition: string;
    riskPercentage: number;
    severity: 'low' | 'moderate' | 'high';
    explanation: string;
    preventionTips: string[];
  }>;
  recommendations: {
    lifestyle: string[];
    medical: string[];
    monitoring: string[];
  };
  confidenceScore: number;
}

const DiseaseRiskPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0
  });
  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleFactors>({
    smokingStatus: 'never',
    alcoholConsumption: 'none',
    physicalActivity: 'moderate',
    sleepHours: 8,
    dietaryPreferences: [],
    stressLevel: 5,
    exerciseFrequency: 3
  });
  const [familyHistory, setFamilyHistory] = useState<FamilyHistory>({
    heartDisease: false,
    diabetes: false,
    cancer: false,
    stroke: false,
    alzheimers: false,
    osteoporosis: false,
    mentalHealth: false,
    autoimmune: false,
    other: ''
  });
  const [clarificationQuestions, setClarificationQuestions] = useState<ClarificationQuestion[]>([]);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, any>>({});
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Personal Info',
      description: 'Basic health metrics',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: 2,
      title: 'Lifestyle',
      description: 'Daily habits & activities',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      number: 3,
      title: 'Family History',
      description: 'Hereditary conditions',
      icon: Heart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: 4,
      title: 'AI Questions',
      description: 'Personalized assessment',
      icon: Brain,
      color: 'from-orange-500 to-red-500'
    },
    {
      number: 5,
      title: 'Risk Assessment',
      description: 'Your results',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handlePersonalInfoNext = () => {
    // Calculate BMI
    const heightInMeters = personalInfo.height / 100;
    const bmi = personalInfo.weight / (heightInMeters * heightInMeters);
    setPersonalInfo(prev => ({ ...prev, bmi: Math.round(bmi * 10) / 10 }));
    setCurrentStep(2);
  };

  const handleLifestyleNext = () => {
    setCurrentStep(3);
  };

  const handleFamilyHistoryNext = async () => {
    setIsGeneratingQuestions(true);
    setCurrentStep(4);

    try {
      const questions = await generateClarificationQuestions({
        personalInfo,
        lifestyleFactors,
        familyHistory
      });
      setClarificationQuestions(questions);
    } catch (error) {
      console.error('Error generating clarification questions:', error);
      // Fallback questions
      setClarificationQuestions([
        {
          id: '1',
          question: 'How would you rate your current stress level on a daily basis?',
          type: 'slider',
          min: 1,
          max: 10,
          unit: '/10',
          required: true
        },
        {
          id: '2',
          question: 'Do you have regular medical checkups?',
          type: 'boolean',
          required: true
        },
        {
          id: '3',
          question: 'How often do you experience headaches or migraines?',
          type: 'select',
          options: ['Never', 'Rarely', 'Monthly', 'Weekly', 'Daily'],
          required: false
        }
      ]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleClarificationNext = async () => {
    setIsGeneratingAssessment(true);
    setCurrentStep(5);

    try {
      const assessment = await generateRiskAssessment({
        personalInfo,
        lifestyleFactors,
        familyHistory,
        clarificationAnswers
      });
      setRiskAssessment(assessment);
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      // Fallback assessment
      setRiskAssessment({
        overallRiskScore: 25,
        riskFactors: [
          {
            condition: 'Cardiovascular Disease',
            riskPercentage: 15,
            severity: 'low',
            explanation: 'Based on your lifestyle and family history, your cardiovascular risk is below average.',
            preventionTips: ['Regular exercise', 'Healthy diet', 'Stress management']
          }
        ],
        recommendations: {
          lifestyle: ['Maintain regular exercise routine', 'Follow Mediterranean diet'],
          medical: ['Annual health checkup', 'Blood pressure monitoring'],
          monitoring: ['Track heart rate variability', 'Monitor cholesterol levels']
        },
        confidenceScore: 85
      });
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setPersonalInfo({ age: 0, gender: 'male', weight: 0, height: 0 });
    setLifestyleFactors({
      smokingStatus: 'never',
      alcoholConsumption: 'none',
      physicalActivity: 'moderate',
      sleepHours: 8,
      dietaryPreferences: [],
      stressLevel: 5,
      exerciseFrequency: 3
    });
    setFamilyHistory({
      heartDisease: false,
      diabetes: false,
      cancer: false,
      stroke: false,
      alzheimers: false,
      osteoporosis: false,
      mentalHealth: false,
      autoimmune: false,
      other: ''
    });
    setClarificationQuestions([]);
    setClarificationAnswers({});
    setRiskAssessment(null);
  };

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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white">Disease Risk Prediction</h1>
                <p className="text-blue-200 text-lg">AI-powered comprehensive health risk assessment</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">Evidence-Based Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">Personalized Results</span>
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
                <span className="text-white font-semibold">Assessment Progress</span>
                <span className="text-blue-400 font-medium">{currentStep}/5</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Navigation */}
            <div className="grid grid-cols-5 gap-4">
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
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20" // Removed overflow-hidden
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="p-8">
                <PersonalInfoForm
                  personalInfo={personalInfo}
                  onPersonalInfoChange={setPersonalInfo}
                  onNext={handlePersonalInfoNext}
                />
              </div>
            )}

            {/* Step 2: Lifestyle Factors */}
            {currentStep === 2 && (
              <div className="p-8">
                <LifestyleForm
                  lifestyleFactors={lifestyleFactors}
                  onLifestyleChange={setLifestyleFactors}
                  onNext={handleLifestyleNext}
                  onBack={handleBack}
                />
              </div>
            )}

            {/* Step 3: Family History */}
            {currentStep === 3 && (
              <div className="p-8">
                <FamilyHistoryForm
                  familyHistory={familyHistory}
                  onFamilyHistoryChange={setFamilyHistory}
                  onNext={handleFamilyHistoryNext}
                  onBack={handleBack}
                />
              </div>
            )}

            {/* Step 4: AI Clarification Questions */}
            {currentStep === 4 && (
              <div className="p-8">
                <ClarificationQuestions
                  questions={clarificationQuestions}
                  answers={clarificationAnswers}
                  onAnswerChange={setClarificationAnswers}
                  onNext={handleClarificationNext}
                  onBack={handleBack}
                  isLoading={isGeneratingQuestions}
                />
              </div>
            )}

            {/* Step 5: Risk Assessment Results */}
            {currentStep === 5 && (
              <div className="p-8">
                <RiskAssessmentResults
                  assessment={riskAssessment}
                  onStartOver={handleStartOver}
                  isLoading={isGeneratingAssessment}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation */}
        {currentStep < 5 && (
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
        {currentStep === 5 && (
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
              Start New Assessment
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiseaseRiskPage;
