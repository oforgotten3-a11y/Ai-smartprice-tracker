import React from 'react';

function LoadingSpinner({ size = 'md', color = 'electric-blue', text = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colors = {
    'electric-blue': 'border-electric-blue border-t-transparent',
    'premium-gold': 'border-premium-gold border-t-transparent',
    'royal-purple': 'border-royal-purple border-t-transparent',
    'success': 'border-success border-t-transparent',
    'white': 'border-white border-t-transparent'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}></div>
      {text && <p className="mt-3 text-gray-400">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
