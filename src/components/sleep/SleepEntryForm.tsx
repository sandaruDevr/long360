import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Moon, 
  Clock, 
  Star, 
  Calendar, 
  Save,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
  Brain,
  Heart,
  Zap,
  MessageSquare,
  Sparkles,
  Info,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'; // Ensure ToggleLeft and ToggleRight are imported
import { SleepEntry } from '../../types/sleep';
import { format } from 'date-fns';
import { analyzeSleepData } from '../../services/openaiSleepService';

interface SleepEntryFormProps {
  addSleepEntry: (entryData: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading: boolean;
  latestEntry: SleepEntry | null;
}

const SleepEntryForm: React.FC<SleepEntryFormProps> = ({ 
  addSleepEntry, 
  loading, 
  latestEntry 
}) => { // Removed sleepEntries and updateSleepEntry as they are not directly used here
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [enableAIAnalysis, setEnableAIAnalysis] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    bedtime: '22:30',
    wakeTime: '06:30',
    sleepQuality: 7,
    notes: ''
  });

  const calculateSleepMetrics = () => {
    const bedtime = new Date(`${formData.date}T${formData.bedtime}:00`);
    const wakeTime = new Date(`${formData.date}T${formData.wakeTime}:00`);
    
    // Handle next day wake time
    if (wakeTime < bedtime) {
      wakeTime.setDate(wakeTime.getDate() + 1);
    }
    
    const totalSleepHours = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
    
    // Calculate sleep stages (simplified estimation)
    const deepSleep = totalSleepHours * 0.15; // 15% deep sleep
    const remSleep = totalSleepHours * 0.25; // 25% REM sleep
    const lightSleep = totalSleepHours * 0.55; // 55% light sleep
    const awake = totalSleepHours * 0.05; // 5% awake time
    
    // Calculate sleep efficiency (simplified)
    const sleepEfficiency = Math.max(85, Math.min(98, 90 + (formData.sleepQuality - 5) * 2));
    
    // Calculate sleep score based on duration, quality, and efficiency
    const durationScore = Math.min(100, (totalSleepHours / 8) * 100);
    const qualityScore = formData.sleepQuality * 10;
    const efficiencyScore = sleepEfficiency;
    const sleepScore = Math.round((durationScore + qualityScore + efficiencyScore) / 3);
    
    return {
      totalSleep: Math.round(totalSleepHours * 10) / 10,
      sleepEfficiency: Math.round(sleepEfficiency),
      sleepScore: Math.max(0, Math.min(100, sleepScore)),
      sleepStages: {
        deep: Math.round(deepSleep * 10) / 10,
        rem: Math.round(remSleep * 10) / 10,
        light: Math.round(lightSleep * 10) / 10,
        awake: Math.round(awake * 10) / 10
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.bedtime || !formData.wakeTime) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const metrics = calculateSleepMetrics();
      
      let aiInsights = undefined;
      
      // Perform AI analysis if enabled and notes are provided
      if (enableAIAnalysis && formData.notes.trim()) {
        setIsAnalyzingAI(true);
        try {
          const analysisData = {
            totalSleep: metrics.totalSleep,
            sleepQuality: formData.sleepQuality,
            bedtime: new Date(`${formData.date}T${formData.bedtime}:00`).toISOString(),
            wakeTime: new Date(`${formData.date}T${formData.wakeTime}:00`).toISOString(),
            sleepScore: metrics.sleepScore,
            sleepEfficiency: metrics.sleepEfficiency
          };
          
          aiInsights = await analyzeSleepData(analysisData, formData.notes);
        } catch (aiError) {
          console.error('AI analysis failed:', aiError);
          // Continue without AI insights - don't block the sleep entry
        } finally {
          setIsAnalyzingAI(false);
        }
      }
      
      const sleepEntryData: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        date: formData.date,
        bedtime: new Date(`${formData.date}T${formData.bedtime}:00`).toISOString(),
        wakeTime: new Date(`${formData.date}T${formData.wakeTime}:00`).toISOString(),
        totalSleep: metrics.totalSleep,
        sleepEfficiency: metrics.sleepEfficiency,
        sleepScore: metrics.sleepScore,
        sleepStages: metrics.sleepStages,
        sleepQuality: formData.sleepQuality,
        notes: formData.notes,
        aiInsights
      };

      await addSleepEntry(sleepEntryData);
      
      // Reset form
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        bedtime: '22:30',
        wakeTime: '06:30',
        sleepQuality: 7,
        notes: ''
      });
      setEnableAIAnalysis(false);
      setShowForm(false);
      
    } catch (error) {
      console.error('Error adding sleep entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      bedtime: '22:30',
      wakeTime: '06:30',
      sleepQuality: 7,
      notes: ''
    });
    setEnableAIAnalysis(false);
    setShowForm(false);
  };

  const metrics = calculateSleepMetrics();
  const hasDataForToday = latestEntry && latestEntry.date === format(new Date(), 'yyyy-MM-dd');

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-32 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Sleep Entry</h3>
          <p className="text-gray-300">
            {hasDataForToday 
              ? "Today's sleep data has been recorded" 
              : "Log your sleep data manually with optional AI analysis"
            }
          </p>
        </div>
        
        {!hasDataForToday && (
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className={`p-3 rounded-xl border transition-all ${
              showForm 
                ? 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30' 
                : 'bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? (
              <X className="w-5 h-5 text-red-400" />
            ) : (
              <Plus className="w-5 h-5 text-indigo-400" />
            )}
          </motion.button>
        )}
      </div>

      {/* Today's Entry Display with AI Insights */}
      {hasDataForToday && latestEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Sleep Metrics Card */}
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Today's Sleep Recorded</h4>
                <p className="text-indigo-200">Sleep score: {latestEntry.sleepScore}/100</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{latestEntry.totalSleep}h</div>
                <div className="text-indigo-200 text-sm">Total Sleep</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{latestEntry.sleepEfficiency}%</div>
                <div className="text-indigo-200 text-sm">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{latestEntry.sleepStages.deep}h</div>
                <div className="text-indigo-200 text-sm">Deep Sleep</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{latestEntry.sleepStages.rem}h</div>
                <div className="text-indigo-200 text-sm">REM Sleep</div>
              </div>
            </div>
          </div>

          {/* AI Insights Display */}
          {latestEntry.aiInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-6" // Added mt-6 for spacing
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">AI Sleep Analysis</h4>
                  <p className="text-purple-200 text-sm">Confidence: {latestEntry.aiInsights.confidenceScore}%</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Overall Analysis */}
                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="text-white font-semibold mb-2">Overall Analysis</h5>
                  <p className="text-gray-300 leading-relaxed">{latestEntry.aiInsights.overallAnalysis}</p>
                </div>

                {/* Key Factors */}
                {latestEntry.aiInsights.keyFactors.length > 0 && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-3">Key Factors</h5>
                    <div className="space-y-2">
                      {latestEntry.aiInsights.keyFactors.map((factor, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            factor.impact === 'High' ? 'bg-red-400' :
                            factor.impact === 'Moderate' ? 'bg-yellow-400' : 'bg-emerald-400'
                          }`}></div>
                          <div>
                            <span className="text-white font-medium">{factor.factor}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              factor.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                              factor.impact === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {factor.impact} Impact
                            </span>
                            <p className="text-gray-300 text-sm mt-1">{factor.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalized Tips */}
                {latestEntry.aiInsights.personalizedTips.length > 0 && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="text-white font-semibold mb-3">Personalized Tips</h5>
                    <div className="space-y-2">
                      {latestEntry.aiInsights.personalizedTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Potential Issues */}
                {latestEntry.aiInsights.potentialIssues && latestEntry.aiInsights.potentialIssues.length > 0 && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <h5 className="text-red-300 font-semibold mb-3 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Areas for Attention</span>
                    </h5>
                    <div className="space-y-2">
                      {latestEntry.aiInsights.potentialIssues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-red-200 text-sm leading-relaxed">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Enhanced Manual Entry Form */}
      <AnimatePresence>
        {showForm && !hasDataForToday && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
              <div className="flex items-center space-x-3 mb-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                <h4 className="text-white font-semibold">Manual Sleep Entry</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Enter your sleep data manually. Add notes for AI-powered insights and personalized recommendations.
              </p>
            </div>

            {/* Date and Times */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Sleep Date</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <Moon className="w-4 h-4" />
                  <span>Bedtime</span>
                </label>
                <input
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedtime: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Wake Time</span>
                </label>
                <input
                  type="time"
                  value={formData.wakeTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, wakeTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Sleep Quality Rating */}
            <div className="space-y-3">
              <label className="text-white font-semibold flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Sleep Quality (1-10)</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleepQuality}
                    onChange={(e) => setFormData(prev => ({ ...prev, sleepQuality: Number(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{formData.sleepQuality}</div>
                  <div className="text-gray-400 text-xs">Rating</div>
                </div>
              </div>
            </div>

            {/* Enhanced Notes Section with AI Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-white font-semibold flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Sleep Experience Notes</span>
                  <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </label>
                
                {/* AI Analysis Toggle */}
                <motion.button
                  type="button"
                  onClick={() => setEnableAIAnalysis(!enableAIAnalysis)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                    enableAIAnalysis 
                      ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' 
                      : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/15'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {enableAIAnalysis ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Analysis</span>
                </motion.button>
              </div>

              {/* AI Analysis Info */}
              <AnimatePresence>
                {enableAIAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30"
                  >
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-purple-300 font-semibold mb-2">AI Sleep Analysis Enabled</h5>
                        <p className="text-purple-200 text-sm leading-relaxed">
                          Our AI will analyze your sleep metrics along with your notes to provide personalized insights, 
                          identify key factors affecting your sleep, and suggest specific optimization strategies.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={enableAIAnalysis 
                  ? "Describe your sleep experience in detail: How did you feel? What factors might have affected your sleep? (e.g., 'felt restless due to work stress', 'had coffee at 6 PM', 'room was too warm', 'woke up multiple times'). The more detail you provide, the better our AI can help optimize your sleep."
                  : "How did you feel? Any factors that affected your sleep? (Optional)"
                }
                rows={enableAIAnalysis ? 4 : 3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />

              {/* Character count and tips */}
              {enableAIAnalysis && (
                <div className="flex items-center justify-between text-xs">
                  <div className="text-gray-400">
                    {formData.notes.length}/500 characters • More detail = better AI insights
                  </div>
                  {formData.notes.length > 50 && (
                    <div className="flex items-center space-x-1 text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Good detail for AI analysis</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Calculated Metrics Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h5 className="text-white font-semibold mb-3 flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Calculated Metrics</span>
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-indigo-400">{metrics.totalSleep}h</div>
                  <div className="text-gray-400 text-xs">Total Sleep</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">{metrics.sleepScore}</div>
                  <div className="text-gray-400 text-xs">Sleep Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{metrics.sleepEfficiency}%</div>
                  <div className="text-gray-400 text-xs">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-400">{metrics.sleepStages.deep}h</div>
                  <div className="text-gray-400 text-xs">Deep Sleep</div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={isSubmitting || isAnalyzingAI}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={{ scale: (isSubmitting || isAnalyzingAI) ? 1 : 1.02 }}
                whileTap={{ scale: (isSubmitting || isAnalyzingAI) ? 1 : 0.98 }}
              >
                {isAnalyzingAI ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-4 h-4" />
                    </motion.div>
                    <span>AI Analyzing...</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Sleep Entry</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* AI Analysis Progress */}
            <AnimatePresence>
              {isAnalyzingAI && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
                    >
                      <Brain className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <h5 className="text-white font-semibold">AI Sleep Analysis in Progress</h5>
                      <p className="text-purple-200 text-sm">
                        Analyzing your sleep data and notes to generate personalized insights...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Quick Add Button for No Data State */}
      {!showForm && !hasDataForToday && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">No Sleep Data for Today</h4>
          <p className="text-gray-400 mb-6">
            Log your sleep manually with optional AI analysis for personalized insights
          </p>
          <motion.button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Sleep Entry</span>
          </motion.button>
        </div>
      )}

      {/* Enhanced Sleep Entry Tips */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <Info className="w-5 h-5 text-indigo-400" />
            <h4 className="text-white font-semibold">💡 Sleep Tracking Tips</h4>
          </div>
          <div className="space-y-2 text-gray-300 text-sm">
            <p>• <strong>Consistency is key:</strong> Log your sleep data daily for the most accurate trends and insights</p>
            <p>• <strong>Be detailed in notes:</strong> Include factors like stress, caffeine, exercise, room temperature, or anything unusual</p>
            <p>• <strong>AI Analysis:</strong> Enable AI analysis when you have specific sleep concerns or want personalized optimization tips</p>
            <p>• <strong>Track patterns:</strong> Look for correlations between your notes and sleep quality over time</p>
          </div>
        </div>
      </div>

      {/* Custom Styles for Range Slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366F1, #8B5CF6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366F1, #8B5CF6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default SleepEntryForm;