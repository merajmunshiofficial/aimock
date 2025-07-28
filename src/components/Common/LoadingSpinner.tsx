import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text 
}) => {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <span className={`loading loading-spinner ${sizeClasses[size]} text-primary`}></span>
      {text && (
        <p className="mt-2 text-sm text-base-content/70">{text}</p>
      )}
    </div>
  );
};

// Inline loading spinner for buttons
export const InlineSpinner: React.FC<{ size?: 'xs' | 'sm' }> = ({ size = 'xs' }) => {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm'
  };

  return (
    <span className={`loading loading-spinner ${sizeClasses[size]} mr-2`}></span>
  );
};

// Full page loading overlay
export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-base-200/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 p-8 rounded-lg shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};
