import React from 'react';
import { Layers } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-[#0B2342]/40 border border-[#168BFF]/15 max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-[#06152B] border border-[#168BFF]/30 flex items-center justify-center text-[#168BFF] mb-4">
        {icon || <Layers className="w-6 h-6" />}
      </div>
      <h3 className="text-xl font-bold text-[#F5F7FC] mb-2">{title}</h3>
      <p className="text-sm text-[#B9C7D9] leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <PrimaryButton onClick={onAction} variant="yellow">
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
};
