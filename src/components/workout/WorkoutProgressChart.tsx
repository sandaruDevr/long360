import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, BarChart3, Target, Zap } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { format, subDays, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';

interface WorkoutProgressChartProps {
  detailed?: boolean;
}

const WorkoutProgressChart: React.FC<WorkoutProgressChartProps> = ({ detailed = false }) => {
  const { workoutSessions, workoutStats, loading } = useWorkout();
  const [timeRange, setTimeRange] = useState('12W');
  const [chartType, setChartType] = useState('performance');

  // Generate progress data from actual workout sessions
  const generateProgressData = () => {
    const weeks = eachWeekOfInterval({
      start: subDays(new Date(), 84), // 12 weeks
      end: new Date()
    });

    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const weekSessions = workoutSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd && session.completed;
      });

      const strengthSessions = weekSessions.filter(s => 
        s.planName?.toLowerCase().includes('strength') || 
        s.exercisesPerformed.some(e => 
          e.exerciseName.toLowerCase().includes('squat') ||
          e.exerciseName.toLowerCase().includes('deadlift') ||
          e.exerciseName.toLowerCase().includes('bench')
        )
      );

      const cardioSessions = weekSessions.filter(s => 
        s.planName?.toLowerCase().includes('cardio') || 
        s.planName?.toLowerCase().includes('hiit') ||
        s.exercisesPerformed.some(e => 
          e.exerciseName.toLowerCase().includes('run') ||
          e.exerciseName.toLowerCase().includes('bike')
        )
      );

      return {
        date: format(weekStart, 'yyyy-MM-dd'),
        strength: strengthSessions.length > 0 ? Math.min(85 + strengthSessions.length * 2, 100) : 75,
        endurance: cardioSessions.length > 0 ? Math.min(75 + cardioSessions.length * 3, 100) : 70,
        volume: weekSessions.reduce((sum, s) => sum + (s.caloriesBurned * 10), 0), // Mock volume calculation
        workouts: weekSessions.length
      };
    });
  };

  const progressData = generateProgressData();

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-80 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold">{`Week: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'volume' ? ' lbs' : entry.dataKey === 'workouts' ? '' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Chart */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Workout Progress</h3>
            <p className="text-gray-300">Track your fitness improvements over time</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
              {['performance', 'volume', 'frequency'].map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                    chartType === type
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
              {['4W', '12W', '6M', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'performance' ? (
              <AreaChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="strengthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="enduranceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  domain={[70, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="strength"
                  stroke="#F97316"
                  strokeWidth={3}
                  fill="url(#strengthGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="endurance"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#enduranceGradient)"
                />
              </AreaChart>
            ) : chartType === 'volume' ? (
              <BarChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="url(#volumeGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="workouts"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-white/10">
          {chartType === 'performance' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Strength Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Endurance Score</span>
              </div>
            </>
          )}
          {chartType === 'volume' && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Training Volume (lbs)</span>
            </div>
          )}
          {chartType === 'frequency' && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-300 text-sm">Weekly Workouts</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {workoutStats ? `${workoutStats.currentStreak}` : '0'}
          </div>
          <div className="text-gray-300 text-sm">Current Streak</div>
          <div className="text-emerald-400 text-xs mt-1">consecutive days</div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {workoutStats ? `${workoutStats.thisWeekWorkouts}` : '0'}
          </div>
          <div className="text-gray-300 text-sm">This Week</div>
          <div className="text-emerald-400 text-xs mt-1">workouts completed</div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {workoutStats ? `${workoutStats.consistency}%` : '0%'}
          </div>
          <div className="text-gray-300 text-sm">Consistency</div>
          <div className="text-emerald-400 text-xs mt-1">completion rate</div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutProgressChart;