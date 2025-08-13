import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Activity, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  ArrowRight,
  Shield,
  Award,
  Globe
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">{t('header.logo')}</span>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6 max-w-sm">
                  {t('footer.description')}
                </p>
                
                {/* Trust Badges */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-gray-300">{t('footer.security')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">{t('footer.certified')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-gray-300">{t('footer.global')}</span>
                  </div>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6">{t('footer.product.title')}</h3>
                <ul className="space-y-4">
                  {[
                    { key: 'features', href: '#features' },
                    { key: 'pricing', href: '#pricing' },
                    { key: 'aiCoach', href: '#ai-coach' },
                    { key: 'genetics', href: '#genetics' },
                    { key: 'biomarkers', href: '#biomarkers' },
                    { key: 'integrations', href: '#integrations' }
                  ].map((item) => (
                    <li key={item.key}>
                      <a 
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <span>{t(`footer.product.${item.key}`)}</span>
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-6">{t('footer.resources.title')}</h3>
                <ul className="space-y-4">
                  {[
                    { key: 'documentation', href: '/docs' },
                    { key: 'apiReference', href: '/api' },
                    { key: 'blog', href: '/blog' },
                    { key: 'research', href: '/research' },
                    { key: 'webinars', href: '/webinars' },
                    { key: 'community', href: '/community' }
                  ].map((item) => (
                    <li key={item.key}>
                      <a 
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <span>{t(`footer.resources.${item.key}`)}</span>
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-6">{t('footer.support.title')}</h3>
                
                {/* Contact Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <a href="mailto:support@longevai360.com" className="text-gray-300 hover:text-white transition-colors">
                      support@longevai360.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <a href="tel:+1-555-LONGEV" className="text-gray-300 hover:text-white transition-colors">
                      +1 (555) LONGEV
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">
                      San Francisco, CA
                    </span>
                  </div>
                </div>

                {/* Support Links */}
                <ul className="space-y-3">
                  {[
                    { key: 'helpCenter', href: '/help' },
                    { key: 'contact', href: '/contact' },
                    { key: 'status', href: '/status' }
                  ].map((item) => (
                    <li key={item.key}>
                      <a 
                        href={item.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <span>{t(`footer.support.${item.key}`)}</span>
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div class="hidden">
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">{t('footer.newsletter.title')}</h3>
                <p className="text-gray-300 mb-6">{t('footer.newsletter.description')}</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder={t('footer.newsletter.placeholder')}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    {t('footer.newsletter.subscribe')}
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 mt-3">
                  {t('footer.newsletter.privacy')}
                </p>
              </div>
            </div>
          </div>
        </div></div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-gray-900/50">
          <div className="px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                
                {/* Copyright */}
                <div className="text-gray-400 text-sm">
                  © {currentYear} LongevAI360. {t('footer.copyright')}
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap items-center space-x-6 text-sm">
                  {[
                    { key: 'privacy', href: '/privacy' },
                    { key: 'terms', href: '/terms' },
                    { key: 'cookies', href: '/cookies' },
                    { key: 'gdpr', href: '/gdpr' }
                  ].map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {t(`footer.legal.${item.key}`)}
                    </a>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  {[
                    { icon: Twitter, href: 'https://twitter.com/longevai360', label: 'Twitter' },
                    { icon: Linkedin, href: 'https://linkedin.com/company/longevai360', label: 'LinkedIn' },
                    { icon: Instagram, href: 'https://instagram.com/longevai360', label: 'Instagram' },
                    { icon: Youtube, href: 'https://youtube.com/@longevai360', label: 'YouTube' }
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;