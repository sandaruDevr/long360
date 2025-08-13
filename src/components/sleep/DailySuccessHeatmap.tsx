import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

interface DailyData {
  date: string;
  success: boolean;
  value?: number;
}

interface DailySuccessHeatmapProps {
  data: DailyData[];
  goalName: string;
  className?: string;
  isExpanded?: boolean;
}

const DailySuccessHeatmap: React.FC<DailySuccessHeatmapProps> = ({ 
  data, 
  goalName, 
  className = '',
  isExpanded = true
}) => {
  // Generate last 6 months of data (180 days)
  const generateHeatmapData = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 179);
    
    const heatmapData: (DailyData | null)[] = [];
    
    for (let i = 0; i < 180; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayData = data.find(d => d.date === dateString);
      heatmapData.push(dayData || null);
    }
    
    return heatmapData;
  };

  const heatmapData = generateHeatmapData();
  
  // Group data by weeks
  const weeks: (DailyData | null)[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getSquareColor = (dayData: DailyData | null) => {
    if (!dayData) return 'bg-white/5';
    return dayData.success ? 'bg-emerald-500' : 'bg-red-500';
  };

  const getSquareOpacity = (dayData: DailyData | null) => {
    if (!dayData) return 'opacity-30';
    return 'opacity-80 hover:opacity-100';
  };

  const formatTooltipDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const successCount = data.filter(d => d.success).length;
  const totalCount = data.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (!isExpanded) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <h4 className="text-white font-semibold">{goalName} - Last 6 Months</h4>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span>{successRate}% success rate</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-sm opacity-60"></div>
            <span>Failed</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-sm opacity-80"></div>
            <span>Success</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-1">
          <div className="w-10"></div>
          <div className="flex-1 grid gap-0 text-xs text-gray-400" style={{ 
            gridTemplateColumns: `repeat(${Math.ceil(weeks.length / 4)}, minmax(0, 1fr))`
          }}>
            {Array.from({ length: Math.ceil(weeks.length / 4) }, (_, i) => {
              const monthIndex = (new Date().getMonth() - Math.ceil(weeks.length / 4) + i + 1 + 12) % 12;
              return (
                <div key={i} className="text-center">
                  {monthLabels[monthIndex].slice(0, 3)}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between w-10 text-xs text-gray-400 pr-2">
            {dayLabels.map((day, index) => (
              <div 
                key={day} 
                className={`h-5 flex items-center ${index % 2 === 0 ? '' : 'opacity-0'}`}
                style={{ lineHeight: '1.2' }}
              >
                {index % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Heatmap squares - Increased size and reduced spacing */}
          <div className="flex-1 grid gap-0.5" style={{ 
            gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`
          }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-0.5">
                {week.map((dayData, dayIndex) => {
                  const isToday = dayData && dayData.date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-5 h-5 rounded-sm transition-all cursor-pointer relative group ${getSquareColor(dayData)} ${getSquareOpacity(dayData)} ${
                        isToday ? 'ring-1 ring-white/50' : ''
                      }`}
                      whileHover={{ scale: 1.25 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: dayData ? 1 : 0.3, scale: 1 }}
                      transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                    >
                      {/* Tooltip */}
                      {dayData && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-gray-700">
                            <div className="font-semibold">{formatTooltipDate(dayData.date)}</div>
                            <div className={dayData.success ? 'text-emerald-400' : 'text-red-400'}>
                              {dayData.success ? 'Goal achieved' : 'Goal missed'}
                              {dayData.value && ` (${dayData.value})`}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{successCount}</div>
            <div className="text-sm text-gray-400">Successful Days</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-400">{totalCount - successCount}</div>
            <div className="text-sm text-gray-400">Missed Days</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">{successRate}%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailySuccessHeatmap;