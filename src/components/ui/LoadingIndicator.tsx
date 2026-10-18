import React from 'react';
import { Zap } from 'lucide-react';

export interface LoadingIndicatorProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  label = 'Loading PokeThon Node...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-xs' },
    md: { container: 'w-14 h-14', icon: 'w-6 h-6', text: 'text-sm' },
    lg: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-base' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div
          className={`${currentSize.container} rounded-full border-2 border-[#168BFF]/20 border-t-[#168BFF] border-r-[#FFD83D] animate-spin`}
        />
        {/* Center glowing icon */}
        <div className="absolute inset-0 flex items-center justify-center text-[#FFD83D]">
          <Zap className={`${currentSize.icon} animate-pulse fill-[#FFD83D]/20`} />
        </div>
      </div>
      {label && (
        <p className={`font-mono font-medium tracking-wide text-[#B9C7D9] ${currentSize.text} animate-pulse`}>
          {label}
        </p>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06152B]/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
