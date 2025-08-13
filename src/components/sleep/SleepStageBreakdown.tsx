import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Moon, Brain, Zap, Clock } from 'lucide-react';
import { SleepEntry } from '../../types/sleep';

interface SleepStageBreakdownProps {
  latestEntry: SleepEntry | null;
  loading: boolean;
}

const SleepStageBreakdown: React.FC<SleepStageBreakdownProps> = ({ latestEntry, loading }) => {
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

  if (!latestEntry) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="text-center py-12">
          <Moon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-white font-semibold mb-2">No Sleep Data</h4>
          <p className="text-gray-400">Start tracking your sleep to see detailed stage breakdown</p>
        </div>
      </div>
    );
  }

  const sleepStageData = [
    { name: 'Deep Sleep', value: latestEntry.sleepStages.deep, color: '#8B5CF6', icon: Brain },
    { name: 'REM Sleep', value: latestEntry.sleepStages.rem, color: '#3B82F6', icon: Zap },
    { name: 'Light Sleep', value: latestEntry.sleepStages.light, color: '#6366F1', icon: Moon },
    { name: 'Awake', value: latestEntry.sleepStages.awake, color: '#64748B', icon: Clock },
  ];

  const totalSleep = latestEntry.totalSleep;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-gray-300">{data.value}h ({Math.round((data.value / totalSleep) * 100)}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Sleep Stage Breakdown</h3>
          <p className="text-gray-300">Last night's sleep composition</p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{totalSleep}h</p>
          <p className="text-gray-400 text-sm">Total Sleep</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Pie Chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sleepStageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {sleepStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalSleep}h</div>
              <div className="text-gray-400 text-sm">Total Sleep</div>
            </div>
          </div>
        </div>

        {/* Stage Details */}
        <div className="space-y-4">
          {sleepStageData.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stage.color }}
                  >
                    <stage.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{stage.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {stage.name === 'Deep Sleep' && 'Physical restoration'}
                      {stage.name === 'REM Sleep' && 'Memory consolidation'}
                      {stage.name === 'Light Sleep' && 'Transition phase'}
                      {stage.name === 'Awake' && 'Brief awakenings'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{stage.value}h</p>
                  <p className="text-gray-400 text-sm">{Math.round((stage.value / totalSleep) * 100)}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.value / totalSleep) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sleep Quality Indicators */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((latestEntry.sleepStages.deep / totalSleep) * 100)}%
            </div>
            <div className="text-gray-400 text-sm">Deep Sleep %</div>
            <div className="text-emerald-400 text-xs">Optimal: 15-20%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {Math.round((latestEntry.sleepStages.rem / totalSleep) * 100)}%
            </div>
            <div className="text-gray-400 text-sm">REM Sleep %</div>
            <div className="text-emerald-400 text-xs">Optimal: 20-25%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {Math.round(latestEntry.sleepStages.awake * 60)} {/* Convert to minutes */}
            </div>
            <div className="text-gray-400 text-sm">Awake (min)</div>
            <div className="text-emerald-400 text-xs">Good: {"<30min"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStageBreakdown;