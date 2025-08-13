import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, Zap, Heart, Brain, Eye, Bone, Calendar, Filter } from 'lucide-react';
import { useNutrition } from '../../hooks/useNutrition';
import { format, subDays, isAfter, isBefore } from 'date-fns';

const micronutrientTargets = {
  vitaminA: { target: 900, unit: 'mcg', icon: Eye, color: '#F59E0B' },
  vitaminC: { target: 90, unit: 'mg', icon: Shield, color: '#10B981' },
  vitaminD: { target: 20, unit: 'mcg', icon: Bone, color: '#F59E0B' },
  vitaminE: { target: 15, unit: 'mg', icon: Heart, color: '#EF4444' },
  vitaminK: { target: 120, unit: 'mcg', icon: Bone, color: '#8B5CF6' },
  vitaminB6: { target: 1.7, unit: 'mg', icon: Brain, color: '#3B82F6' },
  vitaminB12: { target: 2.4, unit: 'mcg', icon: Brain, color: '#8B5CF6' },
  folate: { target: 400, unit: 'mcg', icon: Heart, color: '#10B981' },
  calcium: { target: 1000, unit: 'mg', icon: Bone, color: '#6B7280' },
  iron: { target: 18, unit: 'mg', icon: Heart, color: '#EF4444' },
  magnesium: { target: 400, unit: 'mg', icon: Zap, color: '#10B981' },
  potassium: { target: 3500, unit: 'mg', icon: Heart, color: '#3B82F6' },
  zinc: { target: 11, unit: 'mg', icon: Shield, color: '#6366F1' }
};

const NutrientBreakdown: React.FC = () => {
  const { nutritionHistory, loading } = useNutrition();
  const [timeFilter, setTimeFilter] = useState('7D');
  const [selectedView, setSelectedView] = useState('all');

  const filteredData = useMemo(() => {
    if (!nutritionHistory.length) return [];

    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case '1D':
        startDate = subDays(now, 1);
        break;
      case '7D':
        startDate = subDays(now, 7);
        break;
      case '30D':
        startDate = subDays(now, 30);
        break;
      default:
        return nutritionHistory;
    }

    return nutritionHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return isAfter(entryDate, startDate) && isBefore(entryDate, now);
    });
  }, [nutritionHistory, timeFilter]);

  const aggregatedMicronutrients = useMemo(() => {
    if (!filteredData.length) return {};

    const totals = Object.keys(micronutrientTargets).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as Record<string, number>);

    filteredData.forEach(entry => {
      Object.keys(micronutrientTargets).forEach(key => {
        totals[key] += (entry.micronutrients?.[key as keyof typeof entry.micronutrients] || 0);
      });
    });

    // Calculate averages
    Object.keys(totals).forEach(key => {
      totals[key] = totals[key] / Math.max(filteredData.length, 1);
    });

    return totals;
  }, [filteredData]);

  const chartData = useMemo(() => {
    return Object.entries(micronutrientTargets).map(([key, config]) => {
      const current = aggregatedMicronutrients[key] || 0;
      const percentage = Math.min((current / config.target) * 100, 150);
      
      return {
        name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        current: Math.round(percentage),
        target: 100,
        actualValue: Math.round(current * 100) / 100,
        targetValue: config.target,
        unit: config.unit,
        color: config.color
      };
    });
  }, [aggregatedMicronutrients]);

  const getFilteredNutrients = () => {
    switch (selectedView) {
      case 'vitamins':
        return chartData.filter(item => 
          item.name.toLowerCase().includes('vitamin') || 
          item.name.toLowerCase().includes('folate')
        );
      case 'minerals':
        return chartData.filter(item => 
          !item.name.toLowerCase().includes('vitamin') && 
          !item.name.toLowerCase().includes('folate')
        );
      default:
        return chartData;
    }
  };

  const displayData = getFilteredNutrients();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-emerald-400">{`Current: ${data.actualValue}${data.unit}`}</p>
          <p className="text-gray-300">{`Target: ${data.targetValue}${data.unit}`}</p>
          <p className="text-blue-400">{`${data.current}% of RDA`}</p>
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
          <div className="h-64 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Nutrient Breakdown</h3>
          <p className="text-gray-300">
            {timeFilter === '1D' ? 'Today' : 
             timeFilter === '7D' ? 'Last 7 days' : 
             timeFilter === '30D' ? 'Last 30 days' : 'All time'} average intake
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Filter */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            {['1D', '7D', '30D', 'ALL'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  timeFilter === filter
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* View Filter */}
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
            {['all', 'vitamins', 'minerals'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all capitalize ${
                  selectedView === view
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <>
          {/* Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                  domain={[0, 150]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="current" 
                  fill="url(#nutrientGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="nutrientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayData.map((nutrient, index) => {
              const config = Object.values(micronutrientTargets).find(t => t.color === nutrient.color);
              const IconComponent = config?.icon || Shield;
              
              return (
                <motion.div
                  key={nutrient.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: nutrient.color }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{nutrient.name}</h4>
                      <p className="text-gray-400 text-sm">{nutrient.actualValue}{nutrient.unit} / {nutrient.targetValue}{nutrient.unit}</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">% of RDA</span>
                      <span className="text-xs text-white font-medium">{nutrient.current}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: nutrient.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(nutrient.current, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                      />
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    nutrient.current >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                    nutrient.current >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {nutrient.current >= 90 ? 'Optimal' :
                     nutrient.current >= 70 ? 'Good' : 'Low'}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Insights */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
              <h4 className="text-white font-semibold mb-2">💡 Nutrition Insights</h4>
              <p className="text-gray-300 text-sm">
                {(() => {
                  const lowNutrients = displayData.filter(n => n.current < 70);
                  const optimalNutrients = displayData.filter(n => n.current >= 90);
                  
                  if (lowNutrients.length === 0) {
                    return `Excellent micronutrient profile! All ${displayData.length} nutrients are at good levels.`;
                  } else if (lowNutrients.length <= 2) {
                    return `Good overall nutrition. Focus on improving ${lowNutrients.map(n => n.name).join(' and ')} through targeted food choices.`;
                  } else {
                    return `Consider diversifying your diet to improve ${lowNutrients.length} nutrients that are below optimal levels.`;
                  }
                })()}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">No Nutrition Data</h4>
          <p className="text-gray-400 mb-4">
            Start logging your meals to see detailed micronutrient analysis and trends.
          </p>
        </div>
      )}
    </div>
  );
};

export default NutrientBreakdown;