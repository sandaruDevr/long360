import React from 'react';
import { useTranslation } from 'react-i18next';

const MobileNavigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
      <div className="text-center mb-3">
        <p className="text-sm text-gray-600">{t('mobile.description')}</p>
      </div>
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
        {t('mobile.cta')}
      </button>
    </div>
  );
};

export default MobileNavigation;