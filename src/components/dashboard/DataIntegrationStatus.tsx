import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Watch, Activity, Wifi, WifiOff, Plus, CheckCircle } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  icon: React.ComponentType<any>;
  color: string;
  dataPoints?: number;
}

const dataSources: DataSource[] = [
  {
    id: '1',
    name: 'Apple Watch',
    type: 'Wearable',
    status: 'connected',
    lastSync: '2 min ago',
    icon: Watch,
    color: 'from-gray-600 to-gray-800',
    dataPoints: 1247
  },
  {
    id: '2',
    name: 'Oura Ring',
    type: 'Sleep Tracker',
    status: 'connected',
    lastSync: '5 min ago',
    icon: Activity,
    color: 'from-purple-500 to-indigo-600',
    dataPoints: 892
  },
  {
    id: '3',
    name: '23andMe',
    type: 'Genetic Data',
    status: 'connected',
    lastSync: '1 day ago',
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
    dataPoints: 700000
  },
  {
    id: '4',
    name: 'Lab Results',
    type: 'Biomarkers',
    status: 'syncing',
    lastSync: 'Syncing...',
    icon: Activity,
    color: 'from-blue-500 to-cyan-600',
    dataPoints: 45
  },
  {
    id: '5',
    name: 'MyFitnessPal',
    type: 'Nutrition',
    status: 'disconnected',
    lastSync: '3 days ago',
    icon: Smartphone,
    color: 'from-orange-500 to-red-600'
  }
];

const DataIntegrationStatus: React.FC = () => {
  const connectedSources = dataSources.filter(source => source.status === 'connected').length;
  const totalSources = dataSources.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'syncing': return <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Activity className="w-4 h-4 text-blue-400" /></motion.div>;
      case 'disconnected': return <WifiOff className="w-4 h-4 text-red-400" />;
      default: return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-emerald-400 bg-emerald-500/20';
      case 'syncing': return 'text-blue-400 bg-blue-500/20';
      case 'disconnected': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatDataPoints = (points?: number) => {
    if (!points) return '';
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
    return points.toString();
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Data Sources</h3>
          <p className="text-gray-300">{connectedSources}/{totalSources} connected</p>
        </div>
        
        <motion.button 
          className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 text-blue-400" />
        </motion.button>
      </div>

      {/* Connection Status Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Connection Health</span>
          <span className="text-sm font-semibold text-white">{Math.round((connectedSources / totalSources) * 100)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(connectedSources / totalSources) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Data Sources List */}
      <div className="space-y-3">
        {dataSources.map((source, index) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all hover:bg-white/10 ${
              source.status === 'connected' ? 'border-emerald-500/30' : 
              source.status === 'syncing' ? 'border-blue-500/30' : 'border-red-500/30'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${source.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <source.icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white truncate">{source.name}</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(source.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm">{source.type}</span>
                    {source.dataPoints && (
                      <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded-full">
                        {formatDataPoints(source.dataPoints)} points
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                    {source.status}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-gray-400 text-xs">Last sync: {source.lastSync}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-3 text-white font-medium transition-all flex items-center justify-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Connect New Device</span>
        </button>
      </div>
    </div>
  );
};

export default DataIntegrationStatus;