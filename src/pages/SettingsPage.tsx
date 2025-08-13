import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail,
  Lock,
  Database,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Import data hooks
import { useLongevityData } from '../hooks/useLongevityData';
import { useSleep } from '../hooks/useSleep';
import { useWorkout } from '../hooks/useWorkout';
import { useNutrition } from '../hooks/useNutrition';
import { useSupplement } from '../hooks/useSupplement';

const SettingsPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      workoutReminders: true,
      healthInsights: true,
      weeklyReports: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      publicProfile: false
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'auto',
      units: 'metric'
    }
  });

  // Access data from hooks
  const { longevityScore, biologicalAge, healthspan, vitalityIndex, loading: longevityLoading } = useLongevityData();
  const { sleepStats, loading: sleepLoading } = useSleep();
  const { workoutStats, loading: workoutLoading } = useWorkout();
  const { weeklyNutritionScore, weeklyTotals, loading: nutritionLoading } = useNutrition();
  const { supplementStats, loading: supplementLoading } = useSupplement();

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-purple-500 to-pink-500' },
    { id: 'privacy', label: 'Privacy', icon: Shield, color: 'from-emerald-500 to-teal-500' },
    { id: 'preferences', label: 'Preferences', icon: Settings, color: 'from-orange-500 to-red-500' },
    { id: 'data', label: 'Data & Export', icon: Database, color: 'from-indigo-500 to-purple-500' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleExportPdfReport = async () => {
    setIsExportingPdf(true);
    try {
      const input = document.getElementById('professional-health-report'); // Target the hidden report div
      if (input) {
        // Temporarily make the hidden div visible for html2canvas to capture it correctly
        input.style.position = 'static';
        input.style.left = '0';
        input.style.display = 'block';
        input.style.width = '210mm'; // Set a fixed width for consistent PDF output (A4 width)
        input.style.padding = '20mm'; // Add some padding
        input.style.backgroundColor = 'white'; // Ensure white background for PDF

        const canvas = await html2canvas(input, { scale: 2 }); // Increase scale for better quality
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('LongevAI360_Health_Report.pdf');
        alert('PDF report generated successfully!');

        // Hide the div again after capturing
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        input.style.display = 'none';
        input.style.width = 'auto'; // Reset width
        input.style.padding = '0'; // Reset padding
        input.style.backgroundColor = 'transparent'; // Reset background

      } else {
        alert('Could not find report content to export.');
      }
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Profile Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white font-medium">Display Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser?.displayName || ''}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white font-medium">Email</label>
                  <input
                    type="email"
                    defaultValue={currentUser?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <h5 className="text-white font-semibold mb-4">Change Password</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white font-medium">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-medium">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Notification Preferences</h4>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h5>
                      <p className="text-gray-400 text-sm">
                        {key === 'email' && 'Receive notifications via email'}
                        {key === 'push' && 'Browser push notifications'}
                        {key === 'workoutReminders' && 'Reminders for scheduled workouts'}
                        {key === 'healthInsights' && 'AI-generated health insights'}
                        {key === 'weeklyReports' && 'Weekly progress summaries'}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => updateSetting('notifications', key, !value)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        value ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: value ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Privacy Settings</h4>
              
              <div className="space-y-4">
                {Object.entries(settings.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h5>
                      <p className="text-gray-400 text-sm">
                        {key === 'dataSharing' && 'Share anonymized data for research'}
                        {key === 'analytics' && 'Help improve the platform with usage analytics'}
                        {key === 'publicProfile' && 'Make your profile visible to other users'}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => updateSetting('privacy', key, !value)}
                      className={`w-12 h-6 rounded-full transition-all ${
                        value ? 'bg-emerald-500' : 'bg-white/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: value ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">App Preferences</h4>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-white font-medium">Theme</label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'auto', label: 'Auto', icon: Smartphone }
                    ].map((theme) => (
                      <motion.button
                        key={theme.value}
                        onClick={() => updateSetting('preferences', 'theme', theme.value)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all ${
                          settings.preferences.theme === theme.value
                            ? 'border-blue-500/50 bg-blue-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <theme.icon className="w-4 h-4 text-white" />
                        <span className="text-white">{theme.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium">Units</label>
                  <select
                    value={settings.preferences.units}
                    onChange={(e) => updateSetting('preferences', 'units', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="metric" className="bg-gray-800">Metric (kg, cm)</option>
                    <option value="imperial" className="bg-gray-800">Imperial (lbs, ft)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Data Management</h4>
              
              <div className="space-y-4">
                <motion.button
                  onClick={handleExportPdfReport} // Updated onClick handler
                  disabled={isExportingPdf} // Disable button during export
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-4 text-white transition-all"
                  whileHover={{ scale: isExportingPdf ? 1 : 1.02 }} // Prevent scale on hover if exporting
                  whileTap={{ scale: isExportingPdf ? 1 : 0.98 }} // Prevent scale on tap if exporting
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <div className="font-medium">
                        {isExportingPdf ? ( // Show loading state
                          <span className="flex items-center space-x-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Generating PDF...</span>
                          </span>
                        ) : (
                          'Export PDF Report' // Updated button text
                        )}
                      </div>
                      <div className="text-sm text-gray-400">Download your complete health data as PDF</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-red-500/10 border border-white/20 hover:border-red-500/30 rounded-xl p-4 text-white transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <div className="text-left">
                      <div className="font-medium">Delete Account</div>
                      <div className="text-sm text-gray-400">Permanently delete your account and data</div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
    <>
      {/* Hidden div for PDF report generation */}
      <div id="professional-health-report" style={{ position: 'absolute', left: '-9999px', display: 'none', backgroundColor: 'white', color: 'black', padding: '20px', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#4A00B0' }}>LongevAI360 Personalized Health Report</h1>
        <p style={{ fontSize: '12px', marginBottom: '10px', textAlign: 'center' }}>Report Generated: {new Date().toLocaleDateString()}</p>
        <p style={{ fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>For: {currentUser?.displayName || 'User'} ({currentUser?.email || 'N/A'})</p>

        <div style={{ marginBottom: '20px', border: '1px solid #E0BBE4', borderRadius: '8px', padding: '15px', backgroundColor: '#FDFDFD' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#6B21A8' }}>Overall Longevity Metrics</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Longevity Score:</span> <span>{longevityLoading ? 'Loading...' : `${longevityScore}/10`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Biological Age:</span> <span>{longevityLoading ? 'Loading...' : `${biologicalAge} years`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Healthspan:</span> <span>{longevityLoading ? 'Loading...' : `${healthspan} years`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Vitality Index:</span> <span>{longevityLoading ? 'Loading...' : `${vitalityIndex}%`}</span></li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', border: '1px solid #E0BBE4', borderRadius: '8px', padding: '15px', backgroundColor: '#FDFDFD' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#6B21A8' }}>Sleep Overview</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Duration:</span> <span>{sleepLoading ? 'Loading...' : `${sleepStats?.averageSleepDuration || 0}h`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Score:</span> <span>{sleepLoading ? 'Loading...' : `${sleepStats?.averageSleepScore || 0}/100`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Deep Sleep:</span> <span>{sleepLoading ? 'Loading...' : `${sleepStats?.averageDeepSleep || 0}h`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Consistency:</span> <span>{sleepLoading ? 'Loading...' : `${sleepStats?.consistency || 0}%`}</span></li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', border: '1px solid #E0BBE4', borderRadius: '8px', padding: '15px', backgroundColor: '#FDFDFD' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#6B21A8' }}>Workout Overview</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Total Workouts:</span> <span>{workoutLoading ? 'Loading...' : `${workoutStats?.totalWorkouts || 0}`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Duration:</span> <span>{workoutLoading ? 'Loading...' : `${workoutStats?.averageDuration || 0} min`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Consistency:</span> <span>{workoutLoading ? 'Loading...' : `${workoutStats?.consistency || 0}%`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Longest Streak:</span> <span>{workoutLoading ? 'Loading...' : `${workoutStats?.longestStreak || 0} days`}</span></li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', border: '1px solid #E0BBE4', borderRadius: '8px', padding: '15px', backgroundColor: '#FDFDFD' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#6B21A8' }}>Nutrition Overview</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Weekly Score:</span> <span>{nutritionLoading ? 'Loading...' : `${weeklyNutritionScore || 0}/100`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Daily Calories:</span> <span>{nutritionLoading ? 'Loading...' : `${Math.round((weeklyTotals?.calories || 0) / 7)} kcal`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Daily Protein:</span> <span>{nutritionLoading ? 'Loading...' : `${Math.round((weeklyTotals?.protein || 0) / 7)}g`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Daily Fiber:</span> <span>{nutritionLoading ? 'Loading...' : `${Math.round((weeklyTotals?.fiber || 0) / 7)}g`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Avg. Daily Fiber:</span> <span>{nutritionLoading ? 'Loading...' : `${Math.round((weeklyTotals?.fiber || 0) / 7)}g`}</span></li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px', border: '1px solid #E0BBE4', borderRadius: '8px', padding: '15px', backgroundColor: '#FDFDFD' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#6B21A8' }}>Supplement Overview</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Active Supplements:</span> <span>{supplementLoading ? 'Loading...' : `${supplementStats?.activeSupplements || 0}`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Adherence Rate:</span> <span>{supplementLoading ? 'Loading...' : `${supplementStats?.adherenceRate || 0}%`}</span></li>
            <li style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Optimization Score:</span> <span>{supplementLoading ? 'Loading...' : `${supplementStats?.supplementScore || 0}/100`}</span></li>
          </ul>
        </div>

        <p style={{ fontSize: '10px', color: '#666', marginTop: '30px', textAlign: 'center' }}>
          Disclaimer: This report is for informational purposes only and should not replace professional medical advice. Consult with a healthcare provider for personalized guidance.
        </p>
      </div>

      <motion.div 
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-300">Manage your account and preferences</p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{currentUser?.displayName || 'User'}</h3>
                <p className="text-gray-300">{currentUser?.email}</p>
                <p className="text-blue-400 text-sm">Premium Member</p>
              </div>
              <motion.button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
              <div className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-white/20 border border-white/30'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center`}>
                      <section.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`font-medium ${activeSection === section.id ? 'text-white' : 'text-gray-300'}`}>
                      {section.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              {renderSection()}
              
              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsPage;
