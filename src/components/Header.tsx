import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="relative z-[100] px-6 lg:px-8 py-3">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">{t('header.logo')}</span>
        </div>
        
        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('header.features')}</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">{t('header.pricing')}</a>
          
          {/* Trust Badge */}
          <div className="text-sm text-gray-600 flex items-center space-x-1">
            <span>{t('header.trustBadge')}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          
          {/* Language Toggle */}
          <LanguageToggle />
          
          <button 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isAuthenticated ? 'Dashboard' : t('header.getStarted')}
          </button>
          
          {!isAuthenticated && (
            <button 
              onClick={() => navigate('/auth')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('header.login')}
            </button>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <div className="flex items-center space-x-3">
            <LanguageToggle />
          <button className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;