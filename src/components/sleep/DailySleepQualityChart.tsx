import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Moon,
  Calendar
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SleepEntry } from '../../types/sleep';

interface DailySleepQualityChartProps {
  sleepEntries: SleepEntry[];
  loading?: boolean;
}

const DailySleepQualityChart: React.FC<DailySleepQualityChartProps> = ({
  sleepEntries = [],
  loading = false
}) => {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    if (!sleepEntries || sleepEntries.length === 0) return [];
    
    return sleepEntries
      .slice(-30) // Last 30 days
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        sleepScore: entry.sleepScore || 0,
        duration: entry.duration || 0,
        efficiency: entry.efficiency || 0,
        fullDate: entry.date
      }));
  }, [sleepEntries]);

  const stats = useMemo(() => {
    if (!sleepEntries || sleepEntries.length === 0) {
      return {
        averageScore: 0,
        trend: 0,
        bestScore: 0,
        worstScore: 0
      };
    }

    const scores = sleepEntries.map(entry => entry.sleepScore || 0);
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    // Calculate trend (last 7 days vs previous 7 days)
    const recent = sleepEntries.slice(0, 7);
    const previous = sleepEntries.slice(7, 14);
    
    const recentAvg = recent.length > 0 
      ? recent.reduce((sum, entry) => sum + (entry.sleepScore || 0), 0) / recent.length 
      : 0;
    const previousAvg = previous.length > 0 
      ? previous.reduce((sum, entry) => sum + (entry.sleepScore || 0), 0) / previous.length 
      : 0;
    
    const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    
    return {
      averageScore,
      trend: Math.round(trend * 10) / 10,
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores)
    };
  }, [sleepEntries]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-300 text-sm">
                {entry.name}: <span className="text-white font-semibold">{entry.value}</span>
                {entry.dataKey === 'sleepScore' && '/100'}
                {entry.dataKey === 'duration' && 'h'}
                {entry.dataKey === 'efficiency' && '%'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Daily Sleep Quality</h3>
            <p className="text-gray-300 text-sm">Track your sleep trends over time</p>
          </div>
        </div>
        <div className="h-80 bg-white/5 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!sleepEntries || sleepEntries.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Daily Sleep Quality</h3>
            <p className="text-gray-300 text-sm">Track your sleep trends over time</p>
          </div>
        </div>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-2">No sleep data available</p>
          <p className="text-gray-400 text-sm">Start tracking your sleep to see trends and insights</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Daily Sleep Quality</h3>
            <p className="text-gray-300 text-sm">Last 30 days sleep score trends</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.averageScore}</div>
            <div className="text-xs text-gray-400">Avg Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center ${
              stats.trend >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {stats.trend >= 0 ? (
                <TrendingUp className="w-5 h-5 mr-1" />
              ) : (
                <TrendingDown className="w-5 h-5 mr-1" />
              )}
              {Math.abs(stats.trend)}%
            </div>
            <div className="text-xs text-gray-400">7-day Trend</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="sleepScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sleepScore"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#sleepScoreGradient)"
              name="Sleep Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Score Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">{stats.bestScore}</div>
          <div className="text-gray-300 text-sm">Best Score</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{stats.averageScore}</div>
          <div className="text-gray-300 text-sm">Average</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">{stats.worstScore}</div>
          <div className="text-gray-300 text-sm">Lowest Score</div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailySleepQualityChart;