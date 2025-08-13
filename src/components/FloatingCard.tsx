import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FloatingCardProps {
  icon: LucideIcon;
  title: string;
  content: string;
  subContent?: string;
  gradient: string;
  animation: string;
  position: string;
  size?: 'small' | 'medium' | 'large';
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  icon: Icon,
  title,
  content,
  subContent,
  gradient,
  animation,
  position,
  size = 'medium'
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-5'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  const iconInnerSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div className={`absolute ${position} z-20 ${animation}`}>
      <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl ${sizeClasses[size]} border border-gray-100 hover:shadow-3xl transition-all duration-300 hover:scale-105`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className={`${iconSizes[size]} bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
            <Icon className={`${iconInnerSizes[size]} text-white`} />
          </div>
          <span className={`${size === 'small' ? 'text-xs' : 'text-sm'} font-semibold text-gray-800`}>{title}</span>
        </div>
        <div className={`${size === 'large' ? 'text-3xl' : size === 'medium' ? 'text-xl' : 'text-sm'} font-bold ${content.includes('94') ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' : 'text-gray-700'}`}>
          {content}
        </div>
        {subContent && (
          <div className={`${size === 'small' ? 'text-xs' : 'text-xs'} ${subContent.includes('↗') ? 'text-gray-500' : subContent.includes('View details') ? 'text-blue-600' : 'text-gray-600'} mt-1`}>
            {subContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingCard;