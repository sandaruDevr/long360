import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Moon, 
  Clock, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  Sun,
  Heart,
  AlertTriangle
} from 'lucide-react';
import { SleepStats, SleepEntry } from '../../types/sleep';

interface SleepOptimizationProps {
  sleepStats: SleepStats | null;
  latestEntry?: SleepEntry | null;
}

interface SleepInsight {
  id: string;
  title: string;
  description: string;
  actionSteps: string[];
  priority: 'high' | 'medium' | 'low';
  icon: React.ComponentType<any>;
  color: string;
  impact: string;
}

const SleepOptimization: React.FC<SleepOptimizationProps> = ({ sleepStats, latestEntry }) => {
  const generateInsights = (): SleepInsight[] => {
    const insights: SleepInsight[] = [];

    // Prioritize AI insights if available
    if (latestEntry?.aiInsights) {
      // Add AI-driven insights based on key factors
      latestEntry.aiInsights.keyFactors.forEach((factor, index) => {
        if (index < 2) { // Limit to top 2 AI factors
          insights.push({
            id: `ai-factor-${index}`,
            title: `Optimize ${factor.factor}`,
            description: `AI Analysis: ${factor.factor} has ${factor.impact.toLowerCase()} impact on your sleep quality. ${factor.recommendation}`,
            actionSteps: latestEntry.aiInsights!.personalizedTips.slice(index * 2, (index * 2) + 2),
            priority: factor.impact === 'High' ? 'high' : factor.impact === 'Moderate' ? 'medium' : 'low',
            icon: Brain,
            color: 'from-purple-500 to-pink-500',
            impact: `AI-identified ${factor.impact.toLowerCase()} impact factor`
          });
        }
      });
      
      // Add potential issues as high priority insights
      if (latestEntry.aiInsights.potentialIssues && latestEntry.aiInsights.potentialIssues.length > 0) {
        latestEntry.aiInsights.potentialIssues.forEach((issue, index) => {
          if (index < 1) { // Limit to 1 potential issue
            insights.push({
              id: `ai-issue-${index}`,
              title: 'Address Sleep Concern',
              description: `AI has identified a potential concern: ${issue}`,
              actionSteps: latestEntry.aiInsights!.personalizedTips.slice(-2), // Use last 2 tips
              priority: 'high',
              icon: AlertTriangle,
              color: 'from-red-500 to-orange-500',
              impact: 'AI-identified concern requiring attention'
            });
          }
        });
      }
    }
    if (!sleepStats) {
      return [{
        id: 'no-data',
        title: 'Start Sleep Tracking',
        description: 'Begin tracking your sleep to receive personalized optimization insights.',
        actionSteps: [
          'Connect your Apple Watch for automatic tracking',
          'Log your sleep manually for a few days',
          'Maintain consistent sleep schedule'
        ],
        priority: 'medium',
        icon: Moon,
        color: 'from-indigo-500 to-purple-500',
        impact: 'Foundation for sleep optimization'
      }];
    }

    // Sleep Duration Optimization
    if (sleepStats.averageSleepDuration < 7) {
      insights.push({
        id: 'duration',
        title: 'Increase Sleep Duration',
        description: `You're averaging ${sleepStats.averageSleepDuration}h per night. Adults need 7-9 hours for optimal health.`,
        actionSteps: [
          'Set a consistent bedtime 30-60 minutes earlier',
          'Create a wind-down routine starting 1 hour before bed',
          'Limit caffeine intake after 2 PM'
        ],
        priority: 'high',
        icon: Clock,
        color: 'from-red-500 to-orange-500',
        impact: 'Could boost cognitive performance by 25%'
      });
    }

    // Sleep Quality Optimization
    if (sleepStats.averageSleepScore < 80) {
      insights.push({
        id: 'quality',
        title: 'Improve Sleep Quality',
        description: `Your average sleep score is ${sleepStats.averageSleepScore}/100. Let's optimize your sleep environment and habits.`,
        actionSteps: [
          'Keep bedroom temperature between 65-68°F (18-20°C)',
          'Use blackout curtains or sleep mask for complete darkness',
          'Consider white noise machine to mask disruptive sounds',
          'Invest in a comfortable, supportive mattress'
        ],
        priority: 'high',
        icon: Brain,
        color: 'from-purple-500 to-pink-500',
        impact: 'Could improve sleep quality by 30%'
      });
    }

    // Sleep Efficiency Optimization
    if (sleepStats.averageEfficiency < 85) {
      insights.push({
        id: 'efficiency',
        title: 'Boost Sleep Efficiency',
        description: `Your sleep efficiency is ${sleepStats.averageEfficiency}%. Aim for 85%+ for optimal rest.`,
        actionSteps: [
          'Avoid screens 1 hour before bedtime',
          'Practice relaxation techniques like deep breathing',
          'Only use your bed for sleep and intimacy',
          'If you can\'t fall asleep within 20 minutes, get up and do a quiet activity'
        ],
        priority: 'medium',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        impact: 'Could reduce time to fall asleep by 15 minutes'
      });
    }

    // Sleep Consistency Optimization
    if (sleepStats.consistency < 80) {
      insights.push({
        id: 'consistency',
        title: 'Improve Sleep Consistency',
        description: `Your sleep consistency is ${sleepStats.consistency}%. Regular sleep patterns strengthen your circadian rhythm.`,
        actionSteps: [
          'Go to bed and wake up at the same time every day',
          'Avoid sleeping in on weekends by more than 1 hour',
          'Get morning sunlight exposure within 30 minutes of waking',
          'Set phone reminders for bedtime preparation'
        ],
        priority: 'medium',
        icon: Target,
        color: 'from-emerald-500 to-teal-500',
        impact: 'Could stabilize energy levels throughout the day'
      });
    }

    // Deep Sleep Optimization
    if (sleepStats.averageDeepSleep < 1.5) {
      insights.push({
        id: 'deep-sleep',
        title: 'Enhance Deep Sleep',
        description: `You're getting ${sleepStats.averageDeepSleep}h of deep sleep. Aim for 1.5-2h for optimal recovery.`,
        actionSteps: [
          'Exercise regularly, but not within 3 hours of bedtime',
          'Take a warm bath or shower before bed',
          'Keep your bedroom cool and well-ventilated',
          'Consider magnesium supplementation (consult your doctor)'
        ],
        priority: 'medium',
        icon: Shield,
        color: 'from-indigo-500 to-purple-500',
        impact: 'Could improve physical recovery by 40%'
      });
    }

    // Sleep Debt Management
    if (sleepStats.sleepDebt > 2) {
      insights.push({
        id: 'sleep-debt',
        title: 'Address Sleep Debt',
        description: `You have ${sleepStats.sleepDebt}h of sleep debt. This can impact cognitive function and health.`,
        actionSteps: [
          'Gradually extend sleep by 15-30 minutes per night',
          'Prioritize sleep over non-essential activities',
          'Take short 20-minute power naps if needed (before 3 PM)',
          'Focus on sleep quality while catching up'
        ],
        priority: 'high',
        icon: AlertCircle,
        color: 'from-red-500 to-pink-500',
        impact: 'Could restore cognitive performance within 1-2 weeks'
      });
    }

    // If all metrics are good, provide maintenance insights
    if (insights.length === 0) {
      insights.push({
        id: 'maintenance',
        title: 'Maintain Excellent Sleep',
        description: 'Your sleep metrics are excellent! Here are tips to maintain this high performance.',
        actionSteps: [
          'Continue your current sleep schedule consistency',
          'Monitor for any changes in sleep quality',
          'Consider periodic sleep environment optimization',
          'Track how lifestyle changes affect your sleep'
        ],
        priority: 'low',
        icon: CheckCircle,
        color: 'from-emerald-500 to-teal-500',
        impact: 'Sustained optimal health and performance'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!sleepStats) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">Sleep Optimization Ready</h4>
          <p className="text-gray-400 mb-6">
            Start tracking your sleep to receive personalized optimization insights and recommendations.
          </p>
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
            <h5 className="text-white font-semibold mb-2">What you'll get:</h5>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Personalized sleep duration recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Sleep quality improvement strategies</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Circadian rhythm optimization tips</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Sleep environment enhancement guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Sleep Optimization Insights</h3>
          <p className="text-gray-300">AI-powered recommendations based on your sleep data</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-indigo-500/30">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-400 font-semibold text-sm">AI Insights</span>
        </div>
      </div>

      {/* Sleep Score Overview */}
      <div className="mb-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-semibold">Your Sleep Performance</h4>
          <div className="text-2xl font-bold text-white">{sleepStats.averageSleepScore}/100</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-400">{sleepStats.averageSleepDuration}h</div>
            <div className="text-gray-300">Avg Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{sleepStats.averageEfficiency}%</div>
            <div className="text-gray-300">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{sleepStats.consistency}%</div>
            <div className="text-gray-300">Consistency</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{sleepStats.currentStreak}</div>
            <div className="text-gray-300">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Optimization Insights */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <insight.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                    {getPriorityIcon(insight.priority)}
                    <span className="capitalize">{insight.priority}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{insight.description}</p>

                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold text-sm">Potential Impact</span>
                  </div>
                  <p className="text-gray-300 text-sm">{insight.impact}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-white font-semibold text-sm">Action Steps:</h5>
                  {insight.actionSteps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-indigo-400">{stepIndex + 1}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optimization Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-white font-semibold">Sleep Optimization Summary</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {insights.length === 1 && insights[0].id === 'no-data' 
              ? "Start tracking your sleep to unlock personalized optimization insights. Connect your Apple Watch or log sleep manually to begin your optimization journey."
              : insights.filter(i => i.priority === 'high').length > 0
              ? `Focus on ${insights.filter(i => i.priority === 'high').length} high-priority area${insights.filter(i => i.priority === 'high').length > 1 ? 's' : ''} first. Small changes in sleep habits can lead to significant improvements in overall health and performance.`
              : sleepStats.averageSleepScore >= 85
              ? "Your sleep optimization is excellent! Continue maintaining these healthy sleep habits for sustained performance and well-being."
              : "Good progress on your sleep optimization journey. Focus on the recommended areas to further enhance your sleep quality and overall health."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SleepOptimization;