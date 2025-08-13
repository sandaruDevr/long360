import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, TrendingUp, Calendar, CheckCircle, Clock, Brain, Heart, Zap, Shield, Apple, Pill, Star } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { useSleep } from '../../hooks/useSleep';
import { useNutrition } from '../../hooks/useNutrition';
import { useSupplement } from '../../hooks/useSupplement';
import { useLongevityData } from '../../hooks/useLongevityData';

interface AggregatedMilestone {
  id: string;
  title: string;
  description: string;
  targetDate?: string; // Optional, for goals with deadlines
  status: 'completed' | 'in-progress' | 'upcoming';
  progress: number; // 0-100
  icon: React.ComponentType<any>;
  color: string;
}

const HealthMilestones: React.FC = () => {
  const { achievements: workoutAchievements, loading: workoutLoading } = useWorkout();
  const { sleepAchievements, loading: sleepLoading } = useSleep();
  const { goals: nutritionGoals, weeklyTotals, loading: nutritionLoading } = useNutrition(); // Get weeklyTotals
  const { supplementGoals, supplementStats, loading: supplementLoading } = useSupplement(); // Get supplementStats
  const { longevityScore, biologicalAge, healthspan, loading: longevityLoading } = useLongevityData();

  const loading = workoutLoading || sleepLoading || nutritionLoading || supplementLoading || longevityLoading;

  // Helper to get current value for nutrition goals
  const getNutritionGoalCurrentValue = (goal: any): number => {
    if (!weeklyTotals) return 0; // Use weeklyTotals for aggregated data

    switch (goal.type) {
      case 'calories': return weeklyTotals.calories;
      case 'protein': return weeklyTotals.protein;
      case 'carbs': return weeklyTotals.carbs;
      case 'fats': return weeklyTotals.fats;
      case 'fiber': return weeklyTotals.fiber;
      case 'water': return weeklyTotals.waterIntake; // Assuming waterIntake is part of weeklyTotals
      default: return 0;
    }
  };

  // Helper to get current value for supplement goals
  const getSupplementGoalCurrentValue = (goal: any): number => {
    if (!supplementStats) return 0;

    switch (goal.type) {
      case 'adherence': return supplementStats.adherenceRate;
      case 'cost': return supplementStats.totalCost;
      case 'biomarker': return goal.currentProgress; // Assuming biomarker progress is updated elsewhere
      case 'custom': return goal.currentProgress; // Assuming custom progress is updated elsewhere
      default: return 0;
    }
  };


  const aggregatedMilestones: AggregatedMilestone[] = useMemo(() => {
    const allMilestones: AggregatedMilestone[] = [];

    // 1. Workout Achievements
    workoutAchievements.forEach(ach => {
      allMilestones.push({
        id: `workout-${ach.id}`,
        title: ach.title,
        description: ach.description,
        status: ach.isUnlocked ? 'completed' : (ach.currentProgress > 0 ? 'in-progress' : 'upcoming'),
        progress: ach.isUnlocked ? 100 : Math.round((ach.currentProgress / ach.requirement) * 100),
        icon: ach.icon === '🎯' ? Target : ach.icon === '📅' ? Calendar : ach.icon === '💪' ? TrendingUp : ach.icon === '👑' ? Award : Award, // Map emojis to Lucide icons
        color: ach.isUnlocked ? 'from-emerald-500 to-teal-500' : 'from-orange-500 to-red-500',
        targetDate: ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : undefined,
      });
    });

    // 2. Sleep Achievements
    sleepAchievements.forEach(ach => {
      allMilestones.push({
        id: `sleep-${ach.id}`,
        title: ach.title,
        description: ach.description,
        status: ach.isUnlocked ? 'completed' : (ach.currentProgress > 0 ? 'in-progress' : 'upcoming'),
        progress: ach.isUnlocked ? 100 : Math.round((ach.currentProgress / ach.requirement) * 100),
        icon: ach.icon === '🌙' ? Clock : ach.icon === '⭐' ? Star : ach.icon === '🎯' ? Target : ach.icon === '👑' ? Award : Award, // Map emojis to Lucide icons
        color: ach.isUnlocked ? 'from-blue-500 to-indigo-500' : 'from-purple-500 to-pink-500',
        targetDate: ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : undefined,
      });
    });

    // 3. Nutrition Goals (Dynamic Progress)
    nutritionGoals.forEach(goal => {
      const current = getNutritionGoalCurrentValue(goal);
      const progress = Math.min(Math.round((current / goal.target) * 100), 100);
      
      allMilestones.push({
        id: `nutrition-${goal.id}`,
        title: goal.name,
        description: `Target: ${goal.target}${goal.unit}`,
        status: progress >= 100 ? 'completed' : (progress > 0 ? 'in-progress' : 'upcoming'),
        progress: progress,
        icon: goal.type === 'calories' ? Zap : goal.type === 'protein' ? Apple : Target,
        color: progress >= 100 ? 'from-emerald-500 to-teal-500' : 'from-green-500 to-emerald-500',
        targetDate: goal.deadline,
      });
    });

    // 4. Supplement Goals (Dynamic Progress)
    supplementGoals.forEach(goal => {
      const current = getSupplementGoalCurrentValue(goal);
      const progress = Math.min(Math.round((current / goal.target) * 100), 100);

      allMilestones.push({
        id: `supplement-${goal.id}`,
        title: goal.name,
        description: `Target: ${goal.target}${goal.unit}`,
        status: progress >= 100 ? 'completed' : (progress > 0 ? 'in-progress' : 'upcoming'),
        progress: progress,
        icon: goal.type === 'adherence' ? Shield : Pill,
        color: progress >= 100 ? 'from-purple-500 to-pink-500' : 'from-indigo-500 to-purple-500',
        targetDate: goal.deadline,
      });
    });

    // 5. Synthetic Longevity Milestones
    allMilestones.push({
      id: 'longevity-score-milestone',
      title: 'Longevity Score Target',
      description: `Achieve a Longevity Score of 9.0 or higher`,
      status: longevityScore >= 9.0 ? 'completed' : (longevityScore >= 8.0 ? 'in-progress' : 'upcoming'),
      progress: Math.min(Math.round((longevityScore / 9.0) * 100), 100),
      icon: Award,
      color: longevityScore >= 9.0 ? 'from-yellow-500 to-orange-500' : 'from-gray-500 to-slate-600',
    });

    allMilestones.push({
      id: 'biological-age-milestone',
      title: 'Optimal Biological Age',
      description: `Reduce your Biological Age to ${Math.max(20, biologicalAge - 5).toFixed(0)} years`,
      status: biologicalAge <= 30 ? 'completed' : (biologicalAge <= 35 ? 'in-progress' : 'upcoming'),
      progress: Math.min(Math.round(((35 - biologicalAge) / 10) * 100), 100), // Assuming 35 is average, 25 is optimal
      icon: Heart,
      color: biologicalAge <= 30 ? 'from-red-500 to-pink-500' : 'from-gray-500 to-slate-600',
    });

    allMilestones.push({
      id: 'healthspan-milestone',
      title: 'Extended Healthspan',
      description: `Achieve a projected Healthspan of ${Math.min(100, healthspan + 5).toFixed(0)} years`,
      status: healthspan >= 90 ? 'completed' : (healthspan >= 80 ? 'in-progress' : 'upcoming'),
      progress: Math.min(Math.round((healthspan / 90) * 100), 100), // Assuming 90 is optimal
      icon: Brain,
      color: healthspan >= 90 ? 'from-blue-500 to-cyan-500' : 'from-gray-500 to-slate-600',
    });


    // Sort milestones: completed first, then in-progress, then upcoming
    // Within each status, sort by progress (descending) or targetDate
    return allMilestones.sort((a, b) => {
      const statusOrder = { 'completed': 1, 'in-progress': 2, 'upcoming': 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // For same status, sort by progress (descending)
      return (b.progress || 0) - (a.progress || 0);
    });

  }, [workoutAchievements, sleepAchievements, nutritionGoals, weeklyTotals, supplementGoals, supplementStats, longevityScore, biologicalAge, healthspan]);

  const completedMilestonesCount = aggregatedMilestones.filter(m => m.status === 'completed').length;
  const inProgressMilestonesCount = aggregatedMilestones.filter(m => m.status === 'in-progress').length;

  const getStatusColor = (status: AggregatedMilestone['status']) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'in-progress': return 'text-blue-400 bg-blue-500/20';
      case 'upcoming': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status: AggregatedMilestone['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/20 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
              ))}
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
          <h3 className="text-xl font-bold text-white mb-2">Health Milestones</h3>
          <p className="text-gray-300">{completedMilestonesCount} completed • {inProgressMilestonesCount} in progress</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{completedMilestonesCount}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aggregatedMilestones.length > 0 ? (
          aggregatedMilestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all hover:bg-white/10 ${
                milestone.status === 'completed' ? 'border-emerald-500/30' : 
                milestone.status === 'in-progress' ? 'border-blue-500/30' : 'border-white/10'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${milestone.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <milestone.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white truncate">{milestone.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {getStatusText(milestone.status)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{milestone.description}</p>

                  {milestone.status !== 'completed' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-white font-medium">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <motion.div
                          className={`bg-gradient-to-r ${milestone.color} h-1.5 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${milestone.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {milestone.targetDate ? `Target: ${milestone.targetDate}` : 'No target date'}
                      </span>
                    </div>

                    {milestone.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">No Health Milestones Yet</h4>
            <p className="text-gray-400 mb-4">
              Start tracking your health data (workouts, sleep, nutrition, supplements) to see your progress and unlock achievements!
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white font-medium transition-all">
          View All Milestones
        </button>
      </div>
    </div>
  );
};

export default HealthMilestones;
