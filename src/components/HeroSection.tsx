import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroContent from './HeroContent';
import DashboardPreview from './DashboardPreview';
import { useAuth } from '../contexts/AuthContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative z-10 px-6 lg:px-8 py-6 lg:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <HeroContent onGetStarted={() => navigate(isAuthenticated ? '/dashboard' : '/auth')} />
          
          {/* Right Visual */}
          <DashboardPreview />
        </div>
      </div>
    </main>
  );
};

export default HeroSection;