import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { 
  Check, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  Zap,
  Bot,
  Dna,
  Activity,
  Target,
  Upload,
  Headphones,
  Shield,
  TrendingUp,
  Apple,
  Dumbbell,
  ChevronDown
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<any>;
  key: string;
  gradient: string;
}

const features: Feature[] = [
  { icon: Bot, key: "aiCoach", gradient: "from-blue-500 to-cyan-500" },
  { icon: Dna, key: "genetic", gradient: "from-purple-500 to-pink-500" },
  { icon: Activity, key: "biomarker", gradient: "from-emerald-500 to-teal-500" },
  { icon: Shield, key: "diseaseRisk", gradient: "from-red-500 to-orange-500" },
  { icon: Dumbbell, key: "workouts", gradient: "from-indigo-500 to-purple-500" },
  { icon: Apple, key: "nutrition", gradient: "from-green-500 to-emerald-500" },
  { icon: Target, key: "biohacking", gradient: "from-orange-500 to-red-500" },
  { icon: TrendingUp, key: "tracking", gradient: "from-blue-500 to-indigo-500" },
  { icon: Upload, key: "integration", gradient: "from-teal-500 to-cyan-500" },
  { icon: Headphones, key: "support", gradient: "from-rose-500 to-pink-500" }
];

const PricingSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full px-6 py-2 mb-6 animate-fade-in">
            <Crown className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">{t('pricing.badge')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
            <Trans 
              i18nKey="pricing.title"
              components={{
                1: <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent" />
              }}
            />
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Premium Pricing Card Container */}
        <div className="flex justify-center mb-16">
          <div className="relative max-w-2xl w-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {/* Premium Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-3xl blur opacity-30 group-hover:opacity-50 animate-pulse"></div>
            
            {/* Main Pricing Card */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-gray-200 hover:border-emerald-300 transition-all duration-700 hover:shadow-3xl hover:-translate-y-3 group">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-blue-50/20 to-purple-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Premium Badge */}
              <div className="absolute z-50 -top-4 left-1/2 transform -translate-x-1/2" >
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg animate-bounce">
                  {t('pricing.badgeMonthlyPayment')}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 pt-4">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">{t('pricing.cardTitle')}</h3>
                  <p className="text-1.5xl text-gray-600 font-medium">
                    {t('pricing.cardSubtitle')}
                  </p>
                </div>

                {/* Price Section */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-6xl font-black text-gray-900 group-hover:text-gray-800 transition-colors">
                      {t('pricing.price')}
                    </div>
                    <div className="ml-2">
                      <div className="text-2xl font-bold text-gray-600">{t('pricing.cents')}</div>
                      <div className="text-sm text-gray-500 font-medium">{t('pricing.period')}</div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 font-medium mb-6 group-hover:text-gray-700 transition-colors">
                    {t('pricing.billingDetails')}
                  </p>

                  {/* Value Proposition */}
                  <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl p-4 mb-8 group-hover:from-emerald-200 group-hover:to-blue-200 transition-all duration-500">
                    <div className="flex items-center justify-center space-x-2 text-emerald-700">
                      <Sparkles className="w-5 h-5 "  />
                      <span className="font-semibold">{t('pricing.valuePropositionText')}</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-8">
                  {features.map((feature, index) => (
                    <FeatureItem 
                      key={feature.key} 
                      feature={feature} 
                      index={index}
                    />
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full group/btn bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-5 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform mb-6 relative overflow-hidden">
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <span className="flex items-center justify-center relative z-10">
                    {t('pricing.cta')}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>

                {/* Trust Indicators */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{t('pricing.trial')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{t('pricing.cancel')}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {t('pricing.setup')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <div className="text-sm text-gray-600 font-medium">{t('pricing.stats.users')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-sm text-gray-600 font-medium">{t('pricing.stats.satisfaction')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  4.9★
                </div>
                <div className="text-sm text-gray-600 font-medium">{t('pricing.stats.rating')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-sm text-gray-600 font-medium">{t('pricing.stats.doctors')}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              {t('pricing.statsDescription')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  feature: Feature;
  index: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, index }) => {
  const { t } = useTranslation();

  return (
    <div className="relative group/feature">
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-300 cursor-pointer">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-r ${feature.gradient} shadow-lg group-hover/feature:scale-110 transition-transform duration-300`}>
          <feature.icon className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 group-hover/feature:text-gray-800 transition-colors flex-1">
          {t(`pricing.features.${feature.key}`)}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover/feature:text-gray-600 transition-all duration-300 group-hover/feature:rotate-180" />
      </div>

      {/* Hover Dropdown Description */}
      <div className="absolute left-0 right-0 top-full z-50 opacity-0 invisible group-hover/feature:opacity-100 group-hover/feature:visible transition-all duration-300 transform translate-y-2 group-hover/feature:translate-y-0">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-100 mt-2 mx-2">
          <div className="flex items-start space-x-3">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-r ${feature.gradient} shadow-md`}>
              <feature.icon className="w-3 h-3 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                {t(`pricing.features.${feature.key}`)}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t(`pricing.descriptions.${feature.key}`)}
              </p>
            </div>
          </div>
          
          {/* Arrow pointer */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-white/95 border-l border-t border-gray-100 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;