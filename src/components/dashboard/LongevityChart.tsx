import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, BarChart3, Brain, Heart } from 'lucide-react';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';

interface LongevityChartProps {
  longevityScore: number;
}

const LongevityChart: React.FC<LongevityChartProps> = ({ longevityScore }) => {
  const [timeRange, setTimeRange] = useState('12M');
  const [chartType, setChartType] = useState<'score' | 'metrics'>('score'); // 'score' for Longevity Score, 'metrics' for other metrics

  const chartData = React.useMemo(() => {
    const today = new Date();
    let startDate: Date;
    let numMonths: number;

    if (timeRange === '3M') {
      numMonths = 3;
      startDate = subMonths(today, 2);
    } else if (timeRange === '6M') {
      numMonths = 6;
      startDate = subMonths(today, 5);
    } else if (timeRange === '12M') {
      numMonths = 12;
      startDate = subMonths(today, 11);
    } else { // ALL
      numMonths = 24; // Example for 'ALL'
      startDate = subMonths(today, 23);
    }

    const months = eachMonthOfInterval({
      start: startDate,
      end: today
    });

    const data = months.map((month, index) => {
      const startScore = 6.0; // A plausible starting point
      const incrementPerMonth = (longevityScore - startScore) / (numMonths - 1);
      const simulatedScore = startScore + (incrementPerMonth * index);

      const finalScore = parseFloat(Math.max(0, Math.min(longevityScore, simulatedScore)).toFixed(1));
      const targetScore = parseFloat(Math.min(10.0, finalScore + 0.5).toFixed(1));

      return {
        date: format(month, 'yyyy-MM'),
        score: finalScore,
        target: targetScore,
        biologicalAge: parseFloat((35 - (finalScore - 7.0) * 2).toFixed(1)),
        healthspan: parseFloat((80 + (finalScore - 7.0) * 5).toFixed(1)),
      };
    });

    return data;
  }, [longevityScore, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold">{`Month: ${label}`}</p>
          {chartType === 'score' ? (
            <>
              <p className="text-emerald-400">
                {`Score: ${payload[0].value}`}
              </p>
              <p className="text-blue-400">
                {`Target: ${payload[1].value}`}
              </p>
            </>
          ) : (
            <>
              <p className="text-red-400">
                {`Biological Age: ${payload[0].value}`}
              </p>
              <p className="text-blue-400">
                {`Healthspan: ${payload[1].value}`}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const scoreImprovement = chartData.length > 1 ? parseFloat((chartData[chartData.length - 1].score - chartData[0].score).toFixed(1)) : 0;
  const targetAchievement = chartData.length > 0 ? parseFloat(((chartData[chartData.length - 1].score / chartData[chartData.length - 1].target) * 100).toFixed(0)) : 0;
  const monthsTracked = chartData.length;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Longevity Progress</h3>
          <p className="text-gray-300">Track your optimization journey over time</p>
        </div> 
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            {['score', 'metrics'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type as 'score' | 'metrics')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  chartType === type
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {type === 'score' ? 'Longevity Score' : 'Other Metrics'}
              </button>
            ))}
          </div>
        
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            {['3M', '6M', '12M', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
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

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'score' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
                domain={[6, 10]} // Domain for Longevity Score
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#targetGradient)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          ) : ( // chartType === 'metrics'
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <YAxis
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                domain={[20, 90]} // Domain for Biological Age and Healthspan
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="biologicalAge"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="healthspan"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10"> 
        <div className="text-center"> 
          <p className="text-2xl font-bold text-emerald-400">{scoreImprovement >= 0 ? '+' : ''}{scoreImprovement}</p>
          <p className="text-gray-400 text-sm">Score Improvement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">{targetAchievement}%</p>
          <p className="text-gray-400 text-sm">Target Achievement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">{monthsTracked}</p>
          <p className="text-gray-400 text-sm">Months Tracked</p>
        </div>
      </div>
    </div>
  );
};

export default LongevityChart;