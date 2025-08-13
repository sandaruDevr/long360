import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ScrollIndicator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
      <p className="text-sm text-gray-500 mb-2">{t('scroll.text')}</p>
      <ChevronDown className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
    </div>
  );
};

export default ScrollIndicator;