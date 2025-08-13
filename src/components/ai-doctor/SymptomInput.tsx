import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertCircle, Clock, Activity, ChevronRight } from 'lucide-react';

interface Symptom {
  id: string;
  text: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: string;
}

interface SymptomInputProps {
  symptoms: Symptom[];
  onSymptomsChange: (symptoms: Symptom[]) => void;
  onNext: () => void;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ symptoms, onSymptomsChange, onNext }) => {
  const [newSymptom, setNewSymptom] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addSymptom = () => {
    if (newSymptom.trim()) {
      const symptom: Symptom = {
        id: Date.now().toString(),
        text: newSymptom.trim(),
        severity: 'moderate',
        duration: '1-3 days',
        frequency: 'constant'
      };
      onSymptomsChange([...symptoms, symptom]);
      setNewSymptom('');
      setIsAdding(false);
    }
  };

  const removeSymptom = (id: string) => {
    onSymptomsChange(symptoms.filter(s => s.id !== id));
  };

  const updateSymptom = (id: string, field: keyof Symptom, value: string) => {
    onSymptomsChange(symptoms.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'from-green-500 to-emerald-500';
      case 'moderate': return 'from-yellow-500 to-orange-500';
      case 'severe': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Tell Us About Your Symptoms</h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Describe each symptom you're experiencing in detail. The more specific you are, 
          the more accurate our AI analysis will be.
        </p>
      </motion.div>

      {/* Add Symptom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-lg"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Add Your Symptoms</h3>
            <p className="text-gray-300 text-lg">Describe what you're feeling or experiencing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
              placeholder="e.g., persistent headache, mild fever, dry cough..."
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-lg shadow-inner"
            />
            <motion.button
              onClick={addSymptom}
              disabled={!newSymptom.trim()}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: newSymptom.trim() ? 1.02 : 1 }}
              whileTap={{ scale: newSymptom.trim() ? 0.98 : 1 }}
            >
              Add Symptom
            </motion.button>
          </div>

          {/* Quick Symptom Suggestions */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-gray-400 text-sm font-medium">Quick suggestions:</span>
            {['Headache', 'Fever', 'Cough', 'Nausea', 'Fatigue', 'Dizziness'].map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => setNewSymptom(suggestion)}
                className="px-4 py-2 bg-white/5 hover:bg-emerald-500/20 border border-white/20 hover:border-emerald-500/30 rounded-full text-gray-300 hover:text-emerald-300 text-sm transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Symptoms List */}
      <AnimatePresence>
        {symptoms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Your Symptoms ({symptoms.length})</h3>
              <div className="text-gray-300">
                Complete details for accurate analysis
              </div>
            </div>

            <div className="space-y-4">
              {symptoms.map((symptom, index) => (
                <motion.div
                  key={symptom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getSeverityColor(symptom.severity)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">{symptom.text}</h4>
                        <motion.button
                          onClick={() => removeSymptom(symptom.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded-xl"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-gray-300 font-semibold">Severity Level</label>
                          <select
                            value={symptom.severity}
                            onChange={(e) => updateSymptom(symptom.id, 'severity', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          >
                            <option value="mild" className="bg-gray-800">Mild - Barely noticeable</option>
                            <option value="moderate" className="bg-gray-800">Moderate - Noticeable discomfort</option>
                            <option value="severe" className="bg-gray-800">Severe - Significant impact</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-gray-300 font-semibold">Duration</label>
                          <select
                            value={symptom.duration}
                            onChange={(e) => updateSymptom(symptom.id, 'duration', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          >
                            <option value="few hours" className="bg-gray-800">Few hours</option>
                            <option value="1 day" className="bg-gray-800">1 day</option>
                            <option value="1-3 days" className="bg-gray-800">1-3 days</option>
                            <option value="1 week" className="bg-gray-800">1 week</option>
                            <option value="2+ weeks" className="bg-gray-800">2+ weeks</option>
                            <option value="1+ months" className="bg-gray-800">1+ months</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-gray-300 font-semibold">Frequency</label>
                          <select
                            value={symptom.frequency}
                            onChange={(e) => updateSymptom(symptom.id, 'frequency', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          >
                            <option value="constant" className="bg-gray-800">Constant</option>
                            <option value="intermittent" className="bg-gray-800">Comes and goes</option>
                            <option value="occasional" className="bg-gray-800">Occasional</option>
                            <option value="worsening" className="bg-gray-800">Getting worse</option>
                            <option value="improving" className="bg-gray-800">Getting better</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {symptoms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
            <Plus className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Add Your First Symptom</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Start by describing what you're experiencing. Our AI will analyze your symptoms and guide you through relevant questions.
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      {symptoms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-8 mt-8"
        >
          <motion.button
            onClick={onNext}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Continue to Next Step</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SymptomInput;