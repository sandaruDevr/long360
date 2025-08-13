import React from 'react';
import { Activity, Brain, FileText, TrendingUp } from 'lucide-react';
import FloatingCard from './FloatingCard';
import { useTranslation } from 'react-i18next';

const DashboardPreview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative max-w-[80%] mx-auto">
      {/* Main Dashboard Image */}
      <div className="relative z-10">
        <img 
          src="https://i.ibb.co/9HGN2nzD/Chat-GPT-Image-Jul-13-2025-01-02-01-AM.png" 
          alt="Longevity Platform Dashboard Preview"
          className="w-full h-auto rounded-3xl shadow-2xl object-cover"
        />
      </div>
      
      {/* Animated Floating Cards */}
      <FloatingCard
        icon={Activity}
        title={t('floatingCards.healthScore.title')}
        content={t('floatingCards.healthScore.content')}
        subContent={t('floatingCards.healthScore.subContent')}
        gradient="from-green-400 to-emerald-500"
        animation="animate-float-slow"
        position="-bottom-0 -right-10"
        size="medium"
      />
      
      <FloatingCard
        icon={Brain}
        title={t('floatingCards.aiInsights.title')}
        content={t('floatingCards.aiInsights.content')}
        subContent={t('floatingCards.aiInsights.subContent')}
        gradient="from-blue-400 to-indigo-500"
        animation="animate-float-medium"
        position="-bottom-6 -left-6"
        size="medium"
      />
      
      <FloatingCard
        icon={FileText}
        title={t('floatingCards.geneticReport.title')}
        content={t('floatingCards.geneticReport.content')}
        gradient="from-purple-400 to-pink-500"
        animation="animate-float-fast"
        position="top-1/2 -left-20 transform -translate-y-1/2"
        size="small"
      />
      
      <FloatingCard
        icon={TrendingUp}
        title={t('floatingCards.longevityScore.title')}
        content={t('floatingCards.longevityScore.content')}
        subContent={t('floatingCards.longevityScore.subContent')}
        gradient="from-emerald-400 to-teal-500"
        animation="animate-float-slow-reverse"
        position="top-8 -right-20"
        size="small"
      />
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-3xl z-0 scale-110"></div>
    </div>
  );
};

export default DashboardPreview;