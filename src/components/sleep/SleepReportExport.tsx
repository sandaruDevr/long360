import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';
import { SleepEntry } from '../../types/sleep';

interface SleepReportExportProps {
  sleepEntries: SleepEntry[];
  loading: boolean;
}

const SleepReportExport: React.FC<SleepReportExportProps> = ({ sleepEntries, loading }) => {
  const generateReport = (format: 'pdf' | 'csv' | 'json') => {
    // Implementation for generating reports
    console.log(`Generating ${format} report for ${sleepEntries.length} entries`);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-32 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Export Sleep Reports</h3>
          <p className="text-gray-300">Download your sleep data in various formats</p>
        </div>
        <FileText className="w-8 h-8 text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          onClick={() => generateReport('pdf')}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Download className="w-6 h-6 text-red-400" />
            <span className="text-white font-semibold">PDF Report</span>
          </div>
          <p className="text-gray-400 text-sm">Comprehensive sleep analysis with charts and insights</p>
        </motion.button>

        <motion.button
          onClick={() => generateReport('csv')}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Download className="w-6 h-6 text-green-400" />
            <span className="text-white font-semibold">CSV Export</span>
          </div>
          <p className="text-gray-400 text-sm">Raw data for spreadsheet analysis</p>
        </motion.button>

        <motion.button
          onClick={() => generateReport('json')}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Download className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">JSON Data</span>
          </div>
          <p className="text-gray-400 text-sm">Structured data for developers</p>
        </motion.button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Total entries: {sleepEntries.length}</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SleepReportExport;