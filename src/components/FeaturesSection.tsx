import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { 
  Bot, 
  Dumbbell, 
  Apple, 
  Calculator, 
  Shield, 
  Moon, 
  Pill, 
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  delay: string;
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Coach",
    description: "Personalized AI-powered coaching that adapts to your unique biology and lifestyle patterns for optimal results.",
    gradient: "from-blue-500 to-cyan-500",
    delay: "0ms"
  },
  {
    icon: Dumbbell,
    title: "Workouts",
    description: "Science-backed exercise protocols tailored to your genetic profile and fitness goals for maximum longevity impact.",
    gradient: "from-purple-500 to-pink-500",
    delay: "100ms"
  },
  {
    icon: Apple,
    title: "Nutrition",
    description: "Precision nutrition plans based on your metabolic type, genetic variants, and real-time biomarker data.",
    gradient: "from-green-500 to-emerald-500",
    delay: "200ms"
  },
  {
    icon: Calculator,
    title: "Health Calculator",
    description: "Advanced algorithms calculate your biological age, healthspan potential, and longevity trajectory.",
    gradient: "from-orange-500 to-red-500",
    delay: "300ms"
  },
  {
    icon: Shield,
    title: "Disease Risk",
    description: "Comprehensive risk assessment for 150+ conditions with actionable prevention strategies.",
    gradient: "from-indigo-500 to-purple-500",
    delay: "400ms"
  },
  {
    icon: Moon,
    title: "Sleep",
    description: "Optimize your sleep architecture with personalized protocols for enhanced recovery and longevity.",
    gradient: "from-slate-500 to-gray-600",
    delay: "500ms"
  },
  {
    icon: Pill,
    title: "Supplements",
    description: "Precision supplementation recommendations based on your genetic profile and nutrient deficiencies.",
    gradient: "from-teal-500 to-cyan-500",
    delay: "600ms"
  },
  {
    icon: Upload,
    title: "Data Upload",
    description: "Seamlessly integrate data from 100+ devices and lab tests for comprehensive health tracking.",
    gradient: "from-rose-500 to-pink-500",
    delay: "700ms"
  }
];

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">{t('features.badge')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <Trans 
              i18nKey="features.title"
              components={{
                1: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
              }}
            />
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { key: 'aiCoach', icon: Bot, gradient: 'from-blue-500 to-cyan-500' },
            { key: 'workouts', icon: Dumbbell, gradient: 'from-purple-500 to-pink-500' },
            { key: 'nutrition', icon: Apple, gradient: 'from-green-500 to-emerald-500' },
            { key: 'calculator', icon: Calculator, gradient: 'from-orange-500 to-red-500' },
            { key: 'diseaseRisk', icon: Shield, gradient: 'from-indigo-500 to-purple-500' },
            { key: 'sleep', icon: Moon, gradient: 'from-slate-500 to-gray-600' },
            { key: 'supplements', icon: Pill, gradient: 'from-teal-500 to-cyan-500' },
            { key: 'dataUpload', icon: Upload, gradient: 'from-rose-500 to-pink-500' }
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {t(`features.items.${feature.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
                  {t(`features.items.${feature.key}.description`)}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>{t('features.learnMore')}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform">
              {t('features.cta')}
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="text-sm text-gray-500">
              <Trans 
                i18nKey="features.ctaSubtext"
                components={{ 1: <span className="font-semibold text-gray-700" /> }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;