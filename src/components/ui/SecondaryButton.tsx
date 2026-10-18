import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'outline' | 'surface';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  isLoading = false,
  variant = 'surface',
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold text-xs tracking-wide uppercase px-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06152B] whitespace-nowrap shrink-0';

  const styleMap = {
    surface:
      'bg-[#0B2342] text-[#F5F7FC] border border-[#168BFF]/30 hover:border-[#168BFF] hover:bg-[#0f2d54] hover:text-white shadow-sm',
    outline:
      'bg-transparent text-[#F5F7FC] border border-[#168BFF]/40 hover:border-[#FFD83D] hover:text-[#FFD83D] hover:bg-[#168BFF]/10',
  };

  return (
    <button
      className={`${baseStyles} ${styleMap[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#168BFF]" />
          <span>Loading...</span>
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
