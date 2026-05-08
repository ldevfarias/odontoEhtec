import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, icon, fullWidth, className = '', ...props }, ref) => {
    const inputClasses = [
      'oet-input',
      error && 'border-danger-500',
      fullWidth && 'w-full',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && <label className="block text-sm font-semibold mb-2 text-ink-1">{label}</label>}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3">{icon}</span>
          )}
          <input
            ref={ref}
            className={inputClasses}
            style={icon ? { paddingLeft: '40px' } : undefined}
            {...props}
          />
        </div>
        {helperText && (
          <p className={`text-xs mt-1 ${error ? 'text-danger-500' : 'text-ink-3'}`}>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
