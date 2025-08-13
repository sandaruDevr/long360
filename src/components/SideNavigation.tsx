import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Activity, Moon, Apple, Pill, Settings, User, BarChart3, Dumbbell, Brain, Stethoscope, LogOut, Crown, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';

interface SideNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

const navItems: NavItem[] = [
 //do not add home tab
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'ai-coach',
    label: 'AI Coach',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ai-doctor',
    label: 'AI Doctor',
    icon: Stethoscope,
    color: 'from-cyan-500 to-blue-500'
  },
    {
    id: 'disease-risk',
    label: 'Disease Risk',
    icon: Shield,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'nutrition',
    label: 'Nutrition Hub',
    icon: Apple,
    color: 'from-emerald-500 to-teal-500'
  },
   {
    id: 'workout',
    label: 'Workout Center',
    icon: Dumbbell,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'sleep',
    label: 'Sleep Center',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500'
  },

  {
    id: 'supplements',
    label: 'Supplement Tracker',
    icon: Pill,
    color: 'from-purple-500 to-pink-500'
  }
];

const SideNavigation: React.FC<SideNavigationProps> = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNavigation = (pageId: string) => {
    onPageChange(pageId);
    navigate(`/${pageId}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <button 
                onClick={() => navigate('/')}
                className="text-xl font-bold text-white hover:text-gray-200 transition-colors"
              >
                LongevAI360
              </button>
              <p className="text-xs text-gray-400">Health Optimization</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === item.id
                    ? 'bg-white/20 border border-white/30'
                    : 'hover:bg-white/10 border border-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className={`font-medium ${currentPage === item.id ? 'text-white' : 'text-gray-300'}`}>
                  {item.label}
                </span>
                {currentPage === item.id && (
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full ml-auto"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{currentUser?.displayName || 'User'}</p>
              <p className="text-gray-400 text-xs">Premium Member</p>
            </div>
            <motion.button
              onClick={handleSignOut}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;