import React from 'react';
import { Star, Quote, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  metrics: {
    improvement: string;
    timeframe: string;
  };
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Longevity Researcher",
    company: "Stanford Medicine",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "LongevAI360 revolutionized how I approach personalized medicine. The genetic analysis depth is unprecedented, and the AI recommendations have helped my patients achieve remarkable health improvements.",
    rating: 5,
    metrics: {
      improvement: "40% better patient outcomes",
      timeframe: "in 6 months"
    },
    verified: true
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "CEO & Biohacker",
    company: "TechFlow Ventures",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "As someone who's tried every health optimization tool, LongevAI360 stands alone. The personalized protocols based on my genetics have increased my energy levels and cognitive performance dramatically.",
    rating: 5,
    metrics: {
      improvement: "35% energy increase",
      timeframe: "in 3 months"
    },
    verified: true
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    role: "Functional Medicine Doctor",
    company: "Optimal Health Clinic",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "The precision of LongevAI360's recommendations is incredible. It's like having a team of geneticists, nutritionists, and AI experts working 24/7 for each patient. Game-changing technology.",
    rating: 5,
    metrics: {
      improvement: "90% patient satisfaction",
      timeframe: "consistently"
    },
    verified: true
  },
  {
    id: 4,
    name: "James Thompson",
    role: "Former Olympic Athlete",
    company: "Peak Performance Coach",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "At 45, I'm in better shape than I was at 25, thanks to LongevAI360. The platform's exercise and nutrition protocols are perfectly tailored to my genetic profile and recovery needs.",
    rating: 5,
    metrics: {
      improvement: "25% performance boost",
      timeframe: "in 4 months"
    },
    verified: true
  },
  {
    id: 5,
    name: "Dr. Michael Park",
    role: "Preventive Medicine Specialist",
    company: "Longevity Institute",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "LongevAI360's disease risk predictions and prevention strategies are remarkably accurate. It's helping my patients prevent conditions before they develop, truly revolutionizing preventive care.",
    rating: 5,
    metrics: {
      improvement: "60% risk reduction",
      timeframe: "average"
    },
    verified: true
  },
  {
    id: 6,
    name: "Lisa Chang",
    role: "Wellness Entrepreneur",
    company: "Vitality Labs",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content: "The sleep optimization protocols alone have transformed my life. I'm sleeping deeper, waking up refreshed, and my HRV scores have improved by 40%. This platform is the future of health.",
    rating: 5,
    metrics: {
      improvement: "40% better sleep quality",
      timeframe: "in 2 months"
    },
    verified: true
  }
];

const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">{t('testimonials.badge')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <Trans 
              i18nKey="testimonials.title"
              components={{
                1: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
              }}
            />
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.users')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.satisfaction')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.partners')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              4.9★
            </div>
            <div className="text-sm text-gray-600 font-medium">{t('testimonials.stats.rating')}</div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          
          {/* Moving Container */}
          <div className="overflow-hidden">
            <div className="flex space-x-8 animate-scroll-horizontal">
              {/* First Set */}
              {testimonials.map((testimonial) => (
                <TestimonialCard key={`first-${testimonial.id}`} testimonial={testimonial} />
              ))}
              {/* Duplicate Set for Seamless Loop */}
              {testimonials.map((testimonial) => (
                <TestimonialCard key={`second-${testimonial.id}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('testimonials.ctaTitle')}
            </h3>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              {t('testimonials.ctaSubtitle')}
            </p>
            
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                {t('testimonials.cta')}
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-sm text-gray-500">
                <Trans 
                  i18nKey="testimonials.ctaSubtext"
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

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Quote Icon */}
      <div className="flex justify-between items-start mb-4">
        <Quote className="w-8 h-8 text-blue-600/20 transform rotate-180" />
        {testimonial.verified && (
          <div className="flex items-center space-x-1 bg-green-100 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-semibold text-green-700">Verified</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-4 group-hover:text-gray-800 transition-colors">
        "{testimonial.content}"
      </p>

      {/* Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-gray-800">
            {testimonial.metrics.improvement}
          </span>
          <span className="text-sm text-gray-600">
            {testimonial.metrics.timeframe}
          </span>
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center space-x-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
        />
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-600">{testimonial.role}</div>
          <div className="text-xs text-blue-600 font-medium">{testimonial.company}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection