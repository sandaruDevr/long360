import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Scale, Ruler, Calculator, ChevronRight } from 'lucide-react';
import { PersonalInfo } from '../../pages/DiseaseRiskPage';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onPersonalInfoChange: (info: PersonalInfo) => void;
  onNext: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  onPersonalInfoChange,
  onNext
}) => {
  const [formData, setFormData] = useState(personalInfo);
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    if (formData.weight > 0 && formData.height > 0) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = formData.weight / (heightInMeters * heightInMeters);
      setBmi(Math.round(calculatedBmi * 10) / 10);
    } else {
      setBmi(null);
    }
  }, [formData.weight, formData.height]);

  const handleInputChange = (field: keyof PersonalInfo, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onPersonalInfoChange(updatedData);
  };

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Normal', color: 'text-emerald-400' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' };
    return { category: 'Obese', color: 'text-red-400' };
  };

  const canProceed = formData.age > 0 && formData.weight > 0 && formData.height > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Let's Start with Your Basic Information</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          We'll use this information to calculate your BMI and establish baseline health metrics for accurate risk assessment.
        </p>
      </motion.div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Age and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <label className="text-white font-semibold text-lg">Age</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
                placeholder="Enter your age"
                min="18"
                max="120"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <label className="text-white font-semibold text-lg">Gender</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'male', label: 'Male', icon: '👨' },
                { value: 'female', label: 'Female', icon: '👩' },
                { value: 'other', label: 'Other', icon: '👤' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('gender', option.value)}
                  className={`p-4 rounded-xl border transition-all ${
                    formData.gender === option.value
                      ? 'border-blue-500/50 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <span className="text-white font-medium">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Weight and Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <label className="text-white font-semibold text-lg">Weight (kg)</label>
            <div className="relative">
              <Scale className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                placeholder="Enter your weight"
                min="30"
                max="300"
                step="0.1"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <label className="text-white font-semibold text-lg">Height (cm)</label>
            <div className="relative">
              <Ruler className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', Number(e.target.value))}
                placeholder="Enter your height"
                min="100"
                max="250"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                required
              />
            </div>
          </motion.div>
        </div>

        {/* BMI Display */}
        {bmi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">Your BMI: {bmi}</h4>
                <p className={`font-semibold ${getBmiCategory(bmi).color}`}>
                  Category: {getBmiCategory(bmi).category}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  BMI is calculated as weight (kg) ÷ height (m)²
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center pt-8"
      >
        <motion.button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center space-x-4 px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: canProceed ? 1.05 : 1 }}
          whileTap={{ scale: canProceed ? 0.95 : 1 }}
        >
          <span>Continue to Lifestyle</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PersonalInfoForm;