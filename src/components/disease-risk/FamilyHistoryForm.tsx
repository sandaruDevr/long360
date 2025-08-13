import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Shield, 
  Activity,
  ChevronRight,
  ChevronLeft,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';
import { FamilyHistory } from '../../pages/DiseaseRiskPage';

interface FamilyHistoryFormProps {
  familyHistory: FamilyHistory;
  onFamilyHistoryChange: (history: FamilyHistory) => void;
  onNext: () => void;
  onBack: () => void;
}

const FamilyHistoryForm: React.FC<FamilyHistoryFormProps> = ({
  familyHistory,
  onFamilyHistoryChange,
  onNext,
  onBack
}) => {
  const [formData, setFormData] = useState(familyHistory);

  const handleToggle = (field: keyof FamilyHistory, value: boolean | string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onFamilyHistoryChange(updatedData);
  };

  const conditions = [
    {
      key: 'heartDisease' as keyof FamilyHistory,
      label: 'Heart Disease',
      description: 'Heart attacks, coronary artery disease, heart failure',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    },
    {
      key: 'diabetes' as keyof FamilyHistory,
      label: 'Diabetes',
      description: 'Type 1 or Type 2 diabetes mellitus',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'cancer' as keyof FamilyHistory,
      label: 'Cancer',
      description: 'Any type of cancer (breast, lung, colon, etc.)',
      icon: Shield,
      color: 'from-purple-500 to-pink-500'
    },
    {
      key: 'stroke' as keyof FamilyHistory,
      label: 'Stroke',
      description: 'Cerebrovascular accidents, mini-strokes',
      icon: Brain,
      color: 'from-orange-500 to-red-500'
    },
    {
      key: 'alzheimers' as keyof FamilyHistory,
      label: "Alzheimer's/Dementia",
      description: 'Memory disorders, cognitive decline',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      key: 'osteoporosis' as keyof FamilyHistory,
      label: 'Osteoporosis',
      description: 'Bone density loss, frequent fractures',
      icon: Shield,
      color: 'from-gray-500 to-slate-600'
    },
    {
      key: 'mentalHealth' as keyof FamilyHistory,
      label: 'Mental Health',
      description: 'Depression, anxiety, bipolar disorder',
      icon: Brain,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      key: 'autoimmune' as keyof FamilyHistory,
      label: 'Autoimmune Diseases',
      description: 'Rheumatoid arthritis, lupus, MS',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const selectedCount = conditions.filter(condition => 
    formData[condition.key] === true
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Family Medical History</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Genetic predisposition plays a significant role in disease risk. 
          Please indicate if any immediate family members (parents, siblings, grandparents) have had these conditions.
        </p>
      </motion.div>

      {/* Selection Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Family History Summary</h3>
            <p className="text-purple-200">
              {selectedCount === 0 
                ? "No family history conditions selected yet"
                : `${selectedCount} condition${selectedCount > 1 ? 's' : ''} selected`
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map((condition, index) => {
          const isSelected = formData[condition.key] === true;
          
          return (
            <motion.div
              key={condition.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border transition-all hover:bg-white/10 cursor-pointer ${
                isSelected ? 'border-purple-500/50 bg-purple-500/20' : 'border-white/10'
              }`}
              onClick={() => handleToggle(condition.key, !isSelected)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${condition.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <condition.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">{condition.label}</h4>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'border-white/30 hover:border-white/50'
                    }`}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{condition.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Other Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Other Conditions</h3>
        </div>
        <textarea
          value={formData.other}
          onChange={(e) => handleToggle('other', e.target.value)}
          placeholder="Please list any other significant family medical conditions not mentioned above..."
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
        />
      </motion.div>

      {/* Important Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30"
      >
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">Important Note</h4>
            <p className="text-blue-200 leading-relaxed">
              Family history information helps identify genetic predispositions but doesn't guarantee you will develop these conditions. 
              Lifestyle factors often have a greater impact on your actual risk.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex items-center justify-between pt-8"
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

        <motion.button
          onClick={onNext}
          className="flex items-center space-x-4 px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Generate AI Questions</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FamilyHistoryForm;