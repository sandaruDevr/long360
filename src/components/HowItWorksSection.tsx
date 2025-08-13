import React from 'react';
import { Upload, Brain, Target, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface Step {
  number: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  features: string[];
}

const steps: Step[] = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Data",
    description: "Upload genetic data from 23andMe, connect wearables like Apple Watch or Oura Ring, and input health metrics for comprehensive analysis.",
    gradient: "from-blue-500 to-cyan-500",
    features: ["23andMe Integration", "Wearable Sync", "Health Metrics Input"]
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI analyzes 700,000+ genetic variants, tracks 50+ biomarkers, and processes your lifestyle data to create your unique longevity profile.",
    gradient: "from-purple-500 to-pink-500",
    features: ["700K+ Genetic Variants", "50+ Biomarkers", "Lifestyle Processing"]
  },
  {
    number: "03",
    icon: Target,
    title: "Personalized Optimization",
    description: "Receive personalized recommendations for nutrition, exercise, supplements, and biohacking protocols tailored to your genetic makeup and health goals.",
    gradient: "from-emerald-500 to-teal-500",
    features: ["Custom Nutrition", "Exercise Plans", "Supplement Protocols"]
  }
];

const HowItWorksSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">{t('howItWorks.badge')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <Trans 
              i18nKey="howItWorks.title"
              components={{
                1: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
              }}
            />
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 transform -translate-y-1/2 z-0"></div>
          
          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {[
              { key: 'upload', number: '01', icon: Upload, gradient: 'from-blue-500 to-cyan-500' },
              { key: 'analysis', number: '02', icon: Brain, gradient: 'from-purple-500 to-pink-500' },
              { key: 'optimization', number: '03', icon: Target, gradient: 'from-emerald-500 to-teal-500' }
            ].map((step, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Card */}
                <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gray-200 overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Step Number */}
                  <div className="relative z-10 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-5xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-300`}>
                        {step.number}
                      </span>
                      <div className={`w-14 h-14 bg-gradient-to-r ${step.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                      {t(`howItWorks.steps.${step.key}.title`)}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
                      {t(`howItWorks.steps.${step.key}.description`)}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2 mb-4">
                      {['integration', 'wearables', 'metrics'].map((featureKey, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className={`w-4 h-4 text-emerald-500 flex-shrink-0`} />
                          <span className="text-sm font-medium text-gray-700">
                            {t(`howItWorks.steps.${step.key}.features.${featureKey}`)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Learn More Link */}
                    <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span>{t('howItWorks.learnMore')}</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`}></div>
                </div>

                {/* Connection Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Mobile Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8 mb-8">
                    <div className={`w-12 h-12 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg rotate-90`}>
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('howItWorks.ctaTitle')}
            </h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              {t('howItWorks.ctaSubtitle')}
            </p>
            
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                {t('howItWorks.cta')}
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-sm text-gray-500">
                <Trans 
                  i18nKey="howItWorks.ctaSubtext"
                  components={{ 1: <span className="font-semibold text-gray-700" /> }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;