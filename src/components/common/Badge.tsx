import React from 'react';

interface BadgeProps {
  value: number;
  type?: 'percentage' | 'confidence';
  size?: 'sm' | 'md' | 'lg';
}

const Badge: React.FC<BadgeProps> = ({ value, type = 'percentage', size = 'md' }) => {
  // Determine color based on value and type
  let bgColor = '';
  let textColor = '';

  if (type === 'percentage') {
    if (value > 0) {
      bgColor = 'bg-green-100 dark:bg-green-900/30';
      textColor = 'text-green-700 dark:text-green-400';
    } else if (value < 0) {
      bgColor = 'bg-red-100 dark:bg-red-900/30';
      textColor = 'text-red-700 dark:text-red-400';
    } else {
      bgColor = 'bg-gray-100 dark:bg-gray-800';
      textColor = 'text-gray-600 dark:text-gray-400';
    }
  } else if (type === 'confidence') {
    if (value >= 80) {
      bgColor = 'bg-green-100 dark:bg-green-900/30';
      textColor = 'text-green-700 dark:text-green-400';
    } else if (value >= 60) {
      bgColor = 'bg-amber-100 dark:bg-amber-900/30';
      textColor = 'text-amber-700 dark:text-amber-400';
    } else {
      bgColor = 'bg-red-100 dark:bg-red-900/30';
      textColor = 'text-red-700 dark:text-red-400';
    }
  }

  // Determine size
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'text-xs px-1.5 py-0.5';
      break;
    case 'lg':
      sizeClasses = 'text-sm px-3 py-1';
      break;
    default:
      sizeClasses = 'text-xs px-2 py-0.5';
  }

  // Format the value
  const formattedValue = type === 'percentage' 
    ? `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
    : `${value}%`;

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${bgColor} ${textColor} ${sizeClasses}`}>
      {type === 'percentage' && value > 0 && (
        <svg className="w-3 h-3 mr-1\" viewBox="0 0 24 24\" fill="none\" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L12 20M12 4L18 10M12 4L6 10\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
        </svg>
      )}
      {type === 'percentage' && value < 0 && (
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {formattedValue}
    </span>
  );
};

export default Badge;