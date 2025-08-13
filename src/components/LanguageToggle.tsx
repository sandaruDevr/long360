import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update current language when i18n language changes
  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
    setCurrentLanguage(currentLang);
  }, [i18n.language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    
    // Change language using i18next
    i18n.changeLanguage(language.code);
    
    // Add smooth transition effect
    document.documentElement.style.transition = 'opacity 0.3s ease-in-out';
    document.documentElement.style.opacity = '0.95';
    
    setTimeout(() => {
      document.documentElement.style.opacity = '1';
      document.documentElement.style.transition = '';
    }, 300);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Select language"
      >
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="text-lg leading-none">{currentLanguage.flag}</span>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors hidden sm:block">
            {currentLanguage.nativeName}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[9999] transition-all duration-300 transform origin-top-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">{t('language.select')}</span>
          </div>
        </div>

        {/* Language List */}
        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                currentLanguage.code === language.code
                  ? 'bg-blue-50 border-r-2 border-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg leading-none">{language.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language.name}
                  </div>
                </div>
              </div>
              
              {currentLanguage.code === language.code && (
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {t('language.more')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;