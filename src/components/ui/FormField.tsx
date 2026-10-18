import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface BaseFieldProps {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export interface TextInputProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  leftIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  error,
  helperText,
  required,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#B9C7D9]">
          {label} {required && <span className="text-[#FFD83D]">*</span>}
        </label>
      </div>

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#B9C7D9] pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          disabled={disabled}
          className={`w-full bg-[#0B2342] border rounded-lg text-sm text-[#F5F7FC] placeholder-[#B9C7D9]/40 py-2.5 px-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#168BFF] focus:border-[#168BFF] disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500'
              : 'border-[#168BFF]/20 hover:border-[#168BFF]/50'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-400 flex items-center gap-1 mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-[#B9C7D9]/70 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export interface TextAreaProps
  extends BaseFieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
  error,
  helperText,
  required,
  className = '',
  disabled,
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#B9C7D9]">
          {label} {required && <span className="text-[#FFD83D]">*</span>}
        </label>
      </div>

      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        className={`w-full bg-[#0B2342] border rounded-lg text-sm text-[#F5F7FC] placeholder-[#B9C7D9]/40 py-2.5 px-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#168BFF] focus:border-[#168BFF] disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
          error
            ? 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500'
            : 'border-[#168BFF]/20 hover:border-[#168BFF]/50'
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />

      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-400 flex items-center gap-1 mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-[#B9C7D9]/70 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export interface SelectFieldProps
  extends BaseFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  options,
  error,
  helperText,
  required,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#B9C7D9]">
          {label} {required && <span className="text-[#FFD83D]">*</span>}
        </label>
      </div>

      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          className={`w-full appearance-none bg-[#0B2342] border rounded-lg text-sm text-[#F5F7FC] py-2.5 px-3.5 pr-10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#168BFF] focus:border-[#168BFF] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            error
              ? 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500'
              : 'border-[#168BFF]/20 hover:border-[#168BFF]/50'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#06152B] text-[#F5F7FC]">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#B9C7D9]">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-rose-400 flex items-center gap-1 mt-0.5" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-[#B9C7D9]/70 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  id: string;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  error,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer select-none group">
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          className={`mt-0.5 w-4 h-4 rounded bg-[#0B2342] border text-[#168BFF] focus:ring-[#168BFF] focus:ring-offset-[#06152B] focus:ring-offset-1 accent-[#168BFF] cursor-pointer transition-colors ${
            error ? 'border-rose-500' : 'border-[#168BFF]/30 group-hover:border-[#168BFF]'
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <span className="text-xs text-[#B9C7D9] leading-tight select-text">{label}</span>
      </label>
      {error && (
        <p className="text-xs text-rose-400 pl-7" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
