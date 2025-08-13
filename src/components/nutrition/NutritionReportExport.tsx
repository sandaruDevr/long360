import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Mail, 
  Calendar, 
  BarChart3, 
  Share2, 
  Printer,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  format: 'pdf' | 'csv' | 'email';
  icon: React.ComponentType<any>;
  color: string;
  estimatedTime: string;
  features: string[];
}

const reportOptions: ReportOption[] = [
  {
    id: 'comprehensive',
    title: 'Comprehensive Nutrition Report',
    description: 'Detailed analysis with charts, trends, and nutritionist-ready insights',
    format: 'pdf',
    icon: FileText,
    color: 'from-emerald-500 to-teal-600',
    estimatedTime: '2-3 min',
    features: ['Nutrition quality trends', 'Macro analysis', 'Recommendations', 'Medical summary']
  },
  {
    id: 'data-export',
    title: 'Raw Nutrition Data Export',
    description: 'Export all your nutrition data for external analysis',
    format: 'csv',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    estimatedTime: '30 sec',
    features: ['All nutrition metrics', 'Daily scores', 'Food logs', 'Macro breakdowns']
  },
  {
    id: 'nutritionist-summary',
    title: 'Nutritionist Summary',
    description: 'Concise report for healthcare provider or nutritionist consultation',
    format: 'pdf',
    icon: User,
    color: 'from-orange-500 to-red-600',
    estimatedTime: '1-2 min',
    features: ['Key nutrition metrics', 'Deficiency indicators', 'Trend analysis', 'Clinical notes']
  },
  {
    id: 'email-report',
    title: 'Email Weekly Summary',
    description: 'Automated weekly nutrition summary sent to your inbox',
    format: 'email',
    icon: Mail,
    color: 'from-purple-500 to-pink-600',
    estimatedTime: 'Instant',
    features: ['Weekly highlights', 'Goal progress', 'Quick insights', 'Action items']
  }
];

const NutritionReportExport: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<string[]>([]);

  const handleGenerateReport = async (reportId: string) => {
    setSelectedReport(reportId);
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setGeneratedReports(prev => [...prev, reportId]);
    setSelectedReport(null);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return FileText;
      case 'csv': return BarChart3;
      case 'email': return Mail;
      default: return Download;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Export Nutrition Reports</h3>
          <p className="text-gray-300">Generate comprehensive reports for analysis and sharing</p>
        </div>
        
        <motion.button 
          className="p-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Report Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {reportOptions.map((option, index) => {
          const FormatIcon = getFormatIcon(option.format);
          const isGenerated = generatedReports.includes(option.id);
          const isCurrentlyGenerating = selectedReport === option.id && isGenerating;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border transition-all hover:bg-white/10 cursor-pointer ${
                isGenerated ? 'border-emerald-500/30' : 'border-white/10'
              }`}
              onClick={() => !isCurrentlyGenerating && handleGenerateReport(option.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {isCurrentlyGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : isGenerated ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <option.icon className="w-6 h-6 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{option.title}</h4>
                    <div className="flex items-center space-x-2">
                      <FormatIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-xs uppercase">{option.format}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{option.description}</p>

                  {/* Features */}
                  <div className="space-y-1 mb-3">
                    {option.features.slice(0, 2).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-400 text-xs">{feature}</span>
                      </div>
                    ))}
                    {option.features.length > 2 && (
                      <div className="text-gray-500 text-xs">+{option.features.length - 2} more features</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">
                      {isCurrentlyGenerating ? 'Generating...' : `Est. ${option.estimatedTime}`}
                    </span>
                    
                    {isGenerated ? (
                      <motion.button
                        className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                          isCurrentlyGenerating 
                            ? 'text-blue-400' 
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                        whileHover={!isCurrentlyGenerating ? { scale: 1.05 } : {}}
                        disabled={isCurrentlyGenerating}
                      >
                        <span>{isCurrentlyGenerating ? 'Generating...' : 'Generate'}</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.button
          className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-4 text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Printer className="w-5 h-5" />
          <span>Print Summary</span>
        </motion.button>

        <motion.button
          className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-4 text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule Report</span>
        </motion.button>

        <motion.button
          className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-4 text-white transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-5 h-5" />
          <span>Share with Nutritionist</span>
        </motion.button>
      </div>

      {/* Export History */}
      {generatedReports.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-white font-semibold mb-3">Recent Exports</h4>
          <div className="space-y-2">
            {generatedReports.slice(-3).map((reportId, index) => {
              const report = reportOptions.find(r => r.id === reportId);
              if (!report) return null;
              
              return (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm">{report.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-xs">Just now</span>
                    <motion.button
                      className="text-emerald-400 hover:text-emerald-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Insight */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center space-x-3 mb-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h4 className="text-white font-semibold">Export Tip</h4>
          </div>
          <p className="text-gray-300 text-sm">
            Regular nutrition data exports help track long-term dietary patterns and provide valuable insights for 
            nutritionist consultations. Consider sharing reports with your healthcare provider for personalized dietary advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionReportExport;