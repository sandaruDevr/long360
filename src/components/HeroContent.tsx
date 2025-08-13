import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface HeroContentProps {
  onGetStarted: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({ onGetStarted }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center lg:text-left">
      {/* Main Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
        <Trans 
          i18nKey="hero.headline"
          components={{
            1: <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />,
            3: <span className="font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
          }}
        />
      </h1>
      
      {/* Subheading */}
      <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed max-w-2xl">
        {t('hero.subheading')}
      </p>
      
      {/* CTA Section */}
      <div className="mb-6">
        <button 
          onClick={onGetStarted}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform"
        >
          {t('hero.cta')}
          <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-sm text-gray-500 mt-2">{t('hero.ctaSubtext')}</p>
      </div>
      
      {/* Feature Checkmarks */}
      <div className="space-y-2">
        <div className="flex items-center justify-center lg:justify-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-gray-700 font-medium">{t('hero.features.genetic')}</span>
        </div>
        <div className="flex items-center justify-center lg:justify-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-gray-700 font-medium">{t('hero.features.insights')}</span>
        </div>
        <div className="flex items-center justify-center lg:justify-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-gray-700 font-medium">{t('hero.features.reports')}</span>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;