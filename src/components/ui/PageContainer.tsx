import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  badge,
  title,
  description,
  actions,
  maxWidth = 'xl',
}) => {
  const widthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-14rem)] py-12 md:py-16">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow pointer-events-none -z-10" />

      <main className={`mx-auto px-4 sm:px-6 lg:px-8 ${widthClasses[maxWidth]} ${className}`}>
        {(title || badge || description) && (
          <header className="mb-10 pb-6 border-b border-[#168BFF]/15">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-3xl">
                {badge && (
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider uppercase text-[#168BFF] mb-2">
                    <span>{badge}</span>
                    <span aria-hidden="true" className="text-[#FFD83D]">·</span>
                    <span className="text-[#B9C7D9]">PW IOI Noida</span>
                  </div>
                )}
                {title && (
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F7FC] tracking-tight text-balance">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-3 text-base sm:text-lg text-[#B9C7D9] leading-relaxed max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3 shrink-0 pt-2">{actions}</div>}
            </div>
          </header>
        )}
        {children}
      </main>
    </div>
  );
};
