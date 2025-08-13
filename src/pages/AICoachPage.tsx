import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Sparkles,
  User,
  Bot,
  TrendingUp,
  Target,
  Zap,
  Heart,
  Activity,
  Clock,
  Star,
  ChevronDown,
  MoreVertical,
  Bookmark,
  Share2,
  RefreshCw,
  Settings,
  Volume2,
  VolumeX,
  Loader
} from 'lucide-react';
import { generateCoachResponse, generateQuickResponse, quickActions, CoachMessage, QuickAction, HealthContext } from '../services/aiCoach';
import { useSleep } from '../hooks/useSleep';
import { useWorkout } from '../hooks/useWorkout';
import { useNutrition } from '../hooks/useNutrition';
import { useSupplement } from '../hooks/useSupplement';
import { useLongevityData } from '../hooks/useLongevityData';


const AICoachPage: React.FC = () => {
  const { sleepStats } = useSleep();
  const { workoutStats } = useWorkout();
  const { weeklyNutritionScore, getWeeklyAverage } = useNutrition();
  const { supplementStats } = useSupplement();
  const { longevityScore, biologicalAge, healthspan, vitalityIndex } = useLongevityData();

  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "<p>Hey Alex! I'm your AI Longevity Coach. I've got your latest health data - looking good! What do you want to optimize today?</p>",
      timestamp: new Date(),
      suggestions: [
        "How's my sleep looking?",
        "Quick nutrition check",
        "Plan today's workout",
        "Show me this week's wins"
      ],
      insights: [
        {
          id: '1',
          title: 'Sleep Score',
          value: sleepStats?.averageSleepScore?.toString() ?? 'N/A',
          change: '+5', // Placeholder, ideally dynamic
          trend: 'up',
          color: 'text-indigo-400'
        },
        {
          id: '2',
          title: 'Nutrition',
          value: `${weeklyNutritionScore?.toString() ?? 'N/A'}%`,
          change: '+3%', // Placeholder, ideally dynamic
          trend: 'up',
          color: 'text-emerald-400'
        },
        {
          id: '3',
          title: 'Recovery',
          value: `${vitalityIndex?.toString() ?? 'N/A'}%`,
          change: '+8%', // Placeholder, ideally dynamic
          trend: 'up',
          color: 'text-blue-400'
        }
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: CoachMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      // Construct health context from actual data
      const healthContext: HealthContext = {
        sleepScore: sleepStats?.averageSleepScore,
        averageSleepDuration: sleepStats?.averageSleepDuration,
        sleepConsistency: sleepStats?.consistency,
        nutritionScore: weeklyNutritionScore,
        averageCalories: getWeeklyAverage('calories'),
        averageProtein: getWeeklyAverage('protein'),
        workoutConsistency: workoutStats?.consistency,
        totalWorkouts: workoutStats?.totalWorkouts,
        averageWorkoutDuration: workoutStats?.averageDuration,
        supplementScore: supplementStats?.supplementScore,
        activeSupplements: supplementStats?.activeSupplements,
        longevityScore: longevityScore,
        biologicalAge: biologicalAge,
        healthspan: healthspan,
        vitalityIndex: vitalityIndex,
      };

      const response = await generateCoachResponse(content.trim(), healthContext);
      
      const aiResponse: CoachMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        insights: response.insights
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const fallbackResponse: CoachMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "<p>I'm here to help optimize your health! What specific area would you like to focus on?</p>",
        timestamp: new Date(),
        suggestions: [
          "How's my sleep looking?",
          "Quick nutrition check",
          "Plan today's workout",
          "Show me this week's progress"
        ]
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    setIsTyping(true);
    
    try {
      const response = await generateQuickResponse(action);
      
      const aiResponse: CoachMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting quick response:', error);
      const fallbackResponse: CoachMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: "<p>Let me help you with that! What specific guidance do you need?</p>",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input logic would go here
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
    // Text-to-speech logic would go here
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/5 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Longevity Coach</h1>
              <p className="text-gray-300">Your personalized health optimization assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={toggleSpeech}
              className={`p-3 rounded-xl border transition-all ${
                isSpeaking 
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform text-lg">
                {action.category === 'sleep' && '😴'}
                {action.category === 'nutrition' && '🥗'}
                {action.category === 'workout' && '💪'}
                {action.category === 'general' && '📊'}
              </div>
              <span className="font-medium text-sm">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className="flex items-start space-x-3">
                    {message.type === 'ai' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block max-w-full ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl rounded-tr-md' 
                          : 'bg-white/10 backdrop-blur-sm text-white rounded-2xl rounded-tl-md border border-white/20'
                      } p-4`}>
                        <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content }}></div>
                        
                        {/* AI Insights */}
                       
                      </div>
                      
                      <div className={`mt-2 text-xs text-gray-400 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-4 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleSendMessage(suggestion)}
                              className="block w-full text-left bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-3 text-gray-300 hover:text-white transition-all text-sm group/suggestion"
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between">
                                <span>{suggestion}</span>
                                <div className="opacity-0 group-hover/suggestion:opacity-100 transition-opacity">
                                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-md border border-white/20 p-4">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggested Questions */}
          {showSuggestions && messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Quick Starters</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "How's my sleep trending?",
                  "Quick nutrition wins for today?",
                  "Best workout for my energy level?",
                  "What should I focus on this week?",
                  "How am I doing vs my goals?",
                  "Any red flags in my data?"
                ].map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="text-left bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-4 text-gray-300 hover:text-white transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm leading-relaxed">{question}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-white/5 backdrop-blur-xl border-t border-white/10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 focus-within:border-purple-500/50 transition-all">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything - sleep, nutrition, workouts, or just say hi!"
                      className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none max-h-32"
                      rows={1}
                      style={{ minHeight: '24px' }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Paperclip className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      onClick={toggleVoiceInput}
                      className={`p-2 rounded-lg transition-all ${
                        isListening 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: inputValue.trim() ? 1.1 : 1 }}
                      whileTap={{ scale: inputValue.trim() ? 0.9 : 1 }}
                    >
                      {isTyping ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span>Enter to send • Shift+Enter for new line</span>
                <span>Powered by GPT-4o-mini • Private & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachPage;
