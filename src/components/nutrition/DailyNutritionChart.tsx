import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, BarChart3, Apple, Target } from 'lucide-react';
import { useNutrition } from '../../hooks/useNutrition';
import { format, parseISO } from 'date-fns';

const DailyNutritionChart: React.FC = () => {
  const { nutritionHistory, loading } = useNutrition();
  const [timeRange, setTimeRange] = useState('7D');

  const getFilteredData = () => {
    const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : nutritionHistory.length;
    return nutritionHistory
      .filter(entry => entry.date && typeof entry.date === 'string')
      .slice(-days)
      .map(entry => ({
        date: format(parseISO(entry.date), 'MM/dd'),
        score: entry.nutritionScore,
        calories: entry.dailyTotals.calories,
        protein: entry.dailyTotals.protein,
        fiber: entry.dailyTotals.fiber
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold">{`Date: ${label}`}</p>
          <p className="text-emerald-400">{`Nutrition Score: ${data.score}`}</p>
          <p className="text-blue-400">{`Calories: ${data.calories}`}</p>
          <p className="text-purple-400">{`Protein: ${data.protein}g`}</p>
          <p className="text-orange-400">{`Fiber: ${data.fiber}g`}</p>
        </div>
      );
    }
    return null;
  };

  const filteredData = getFilteredData();
  const averageScore = filteredData.length > 0 
    ? Math.round(filteredData.reduce((sum, day) => sum + day.score, 0) / filteredData.length)
    : 0;
  const trend = filteredData.length > 1 
    ? filteredData[filteredData.length - 1].score - filteredData[0].score 
    : 0;

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-64 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Daily Nutrition Quality Trends</h3>
          <p className="text-gray-300">Track your nutrition quality patterns over time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            {['7D', '30D', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <motion.button 
            className="p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">{averageScore}</div>
          <div className="text-gray-400 text-sm">Avg Score</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
          <div className={`text-2xl font-bold mb-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}
          </div>
          <div className="text-gray-400 text-sm">Trend</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {filteredData.length > 0 
              ? Math.round(filteredData.reduce((sum, day) => sum + day.calories, 0) / filteredData.length)
              : 0
            }
          </div>
          <div className="text-gray-400 text-sm">Avg Calories</div>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="nutritionQualityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#nutritionQualityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h4 className="text-white font-semibold">Nutrition Insight</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Your nutrition quality has {trend >= 0 ? 'improved' : 'declined'} by {Math.abs(trend)} points over the selected period. 
                {averageScore >= 85 ? ' Excellent consistency in healthy eating!' : 
                 averageScore >= 75 ? ' Good progress, focus on micronutrient density!' : 
                 ' Consider meal planning for better consistency.'}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-white mb-2">No Nutrition Data</h4>
          <p className="text-gray-400 mb-4">
            Start logging your meals to see nutrition quality trends and analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyNutritionChart;