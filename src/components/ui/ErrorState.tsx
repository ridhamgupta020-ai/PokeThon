import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { SecondaryButton } from './SecondaryButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Node Connection Error',
  message = 'We encountered an unexpected disruption while communicating with the sprint server. Please verify your connection or retry.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-[#0B2342]/60 border border-rose-500/30 max-w-lg mx-auto ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-[#F5F7FC] mb-2">{title}</h3>
      <p className="text-sm text-[#B9C7D9] leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <SecondaryButton
          onClick={onRetry}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          variant="surface"
        >
          Retry Request
        </SecondaryButton>
      )}
    </div>
  );
};
