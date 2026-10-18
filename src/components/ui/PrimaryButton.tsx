import React from 'react';
import { Loader2 } from 'lucide-react';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'yellow' | 'blue';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  variant = 'yellow',
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const isYellow = variant === 'yellow';

  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-tight text-xs uppercase px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06152B] whitespace-nowrap shrink-0';

  const colorStyles = isYellow
    ? 'bg-[#FFD83D] text-[#06152B] hover:bg-[#ffe066] shadow-[0_0_20px_rgba(255,216,61,0.25)] hover:shadow-[0_0_25px_rgba(255,216,61,0.4)] focus-visible:ring-[#FFD83D]'
    : 'bg-[#168BFF] text-white hover:bg-[#0d75db] shadow-[0_0_20px_rgba(22,139,255,0.3)] hover:shadow-[0_0_25px_rgba(22,139,255,0.5)] focus-visible:ring-[#168BFF]';

  return (
    <button
      className={`${baseStyles} ${colorStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
};
