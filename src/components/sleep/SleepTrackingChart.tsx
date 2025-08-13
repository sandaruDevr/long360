import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, Clock, TrendingUp, Moon, Sun, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SleepEntry } from '../../types/sleep';

interface SleepTrackingChartProps {
  sleepEntries: SleepEntry[];
  addSleepEntry: (entryData: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSleepEntry: (entryId: string, updates: Partial<SleepEntry>) => Promise<void>;
  loading: boolean;
}

const SleepTrackingChart: React.FC<SleepTrackingChartProps> = ({ 
  sleepEntries = [], 
  addSleepEntry, 
  updateSleepEntry, 
  loading 
}) => {
  const { t } = useTranslation();
  const [activeChart, setActiveChart] = useState<'duration' | 'quality' | 'stages'>('quality');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');

  const chartData = useMemo(() => {
    if (!sleepEntries || !Array.isArray(sleepEntries)) {
      return [];
    }
    
    const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90;
    return sleepEntries
      .slice(-days)
      .filter(entry => entry && entry.date)
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        duration: entry.totalSleep || 0,
        quality: entry.sleepScore || 0,
        efficiency: entry.sleepEfficiency || 0,
        deepSleep: entry.sleepStages?.deep || 0,
        lightSleep: entry.sleepStages?.light || 0,
        remSleep: entry.sleepStages?.rem || 0,
        awake: entry.sleepStages?.awake || 0,
        bedtime: entry.bedtime,
        wakeTime: entry.wakeTime
      }));
  }, [sleepEntries, timeRange]);

  const sleepStagesData = useMemo(() => {
    const totalEntries = chartData.length;
    if (totalEntries === 0) return [];

    const avgDeep = chartData.reduce((sum, entry) => sum + entry.deepSleep, 0) / totalEntries;
    const avgLight = chartData.reduce((sum, entry) => sum + entry.lightSleep, 0) / totalEntries;
    const avgRem = chartData.reduce((sum, entry) => sum + entry.remSleep, 0) / totalEntries;
    const avgAwake = chartData.reduce((sum, entry) => sum + entry.awake, 0) / totalEntries;

    return [
      { name: 'Deep Sleep', value: avgDeep, color: '#3B82F6' },
      { name: 'Light Sleep', value: avgLight, color: '#60A5FA' },
      { name: 'REM Sleep', value: avgRem, color: '#93C5FD' },
      { name: 'Awake', value: avgAwake, color: '#FCA5A5' }
    ];
  }, [chartData]);

  const averageStats = useMemo(() => {
    if (chartData.length === 0) return { duration: 0, quality: 0, bedtime: '', wakeTime: '' };

    const avgDuration = chartData.reduce((sum, entry) => sum + entry.duration, 0) / chartData.length;
    const avgQuality = chartData.reduce((sum, entry) => sum + entry.quality, 0) / chartData.length;
    
    return {
      duration: avgDuration,
      quality: avgQuality,
      bedtime: '10:30 PM', // Simplified for demo
      wakeTime: '6:30 AM'
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
          <p className="font-medium text-gray-900">{label}</p>
          {data.hasAIInsights && (
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-3 h-3 text-purple-400" />
              <span className="text-purple-400 text-xs font-medium">AI Analyzed</span>
            </div>
          )}
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${
                entry.dataKey === 'duration' 
                  ? `${entry.value.toFixed(1)}h`
                  : entry.dataKey === 'quality'
                  ? `${entry.value}/10`
                  : `${entry.value}min`
              }`}
            </p>
          ))}
          {data.aiAnalysis && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs text-gray-300 italic">{data.aiAnalysis}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

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

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">
            Sleep Tracking & Analysis
          </h3>
          <p className="text-gray-300 mt-1">
            Monitor your sleep patterns and trends over time
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            {(['7D', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
        {[
          { key: 'duration', label: 'Duration', icon: Clock },
          { key: 'quality', label: 'Quality', icon: TrendingUp },
          { key: 'stages', label: 'Stages', icon: Activity }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveChart(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 justify-center ${
              activeChart === key
                ? 'bg-indigo-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="h-80 mb-6">
        {chartData.length > 0 ? (
          <>
            {activeChart === 'duration' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
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
                    domain={[0, 12]}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fill="url(#durationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'quality' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="quality" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeChart === 'stages' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="deepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="remGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
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
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="deepSleep"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="url(#deepGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="remSleep"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="url(#remGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="lightSleep"
                    stackId="1"
                    stroke="#06B6D4"
                    fill="url(#lightGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Moon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">No Sleep Data</h4>
              <p className="text-gray-400">Start tracking your sleep to see detailed analytics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepTrackingChart;