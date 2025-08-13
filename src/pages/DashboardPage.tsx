import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell,
  Settings,
  Search,
  Clock,
  Crown
} from 'lucide-react';
import LongevityScoreCard from '../components/dashboard/LongevityScoreCard';
import LongevityChart from '../components/dashboard/LongevityChart';
import HabitTracker from '../components/dashboard/HabitTracker';
import HealthMilestones from '../components/dashboard/HealthMilestones';
import InsightsFeed from '../components/dashboard/InsightsFeed';
import DataIntegrationStatus from '../components/dashboard/DataIntegrationStatus';
import QuickStats from '../components/dashboard/QuickStats';
import ReportGenerator from '../components/ReportGenerator'; // Ensure this import is correct
import { useLongevityData } from '../hooks/useLongevityData';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const { longevityScore, biologicalAge, healthspan, vitalityIndex, sleepStats, workoutStats, loading: longevityDataLoading } = useLongevityData();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <motion.div 
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Header */}
        <motion.header 
          className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
          variants={itemVariants}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Greeting */}
              <div>
                <p className="text-2xl font-bold text-white">{greeting}, Alex</p>
                <p className="text-gray-300 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
              </div>

              {/* Search & Actions */}
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search insights, habits..."
                    className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                
                <motion.button 
                  onClick={() => navigate('/upgrade')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </motion.button>

                <motion.button 
                  className="relative p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </motion.button>

                <motion.button 
                  onClick={() => navigate('/settings')}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Dashboard Content */}
        <main className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-4">
              <LongevityScoreCard
                longevityScore={longevityScore}
                biologicalAge={biologicalAge}
                healthspan={healthspan}
                vitalityIndex={vitalityIndex}
                sleepStats={sleepStats}
                workoutStats={workoutStats}
                loading={longevityDataLoading}
              />
            

              {/* Longevity Chart */}
              <motion.div variants={itemVariants}> 
                <LongevityChart longevityScore={longevityScore} />
              </motion.div>

           

              {/* Health Milestones */}
              <motion.div variants={itemVariants}>
                <HealthMilestones />
              </motion.div>

            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              
            

              {/* Daily Habits Tracker */}
              <motion.div variants={itemVariants}>
                <HabitTracker />
              </motion.div>

               {/* Report Generator */}
              <motion.div variants={itemVariants}>
                <ReportGenerator />
              </motion.div>

              {/* AI Insights Feed */}
              <motion.div variants={itemVariants}>
                <InsightsFeed />
              </motion.div>

             

            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
