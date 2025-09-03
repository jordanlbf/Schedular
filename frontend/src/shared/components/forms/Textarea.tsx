import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {props.required && <span className="required">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`form-input form-textarea ${error ? 'form-input-error' : ''} ${className}`}
          {...props}
        />
        {error && <div className="form-error">{error}</div>}
        {helperText && <div className="form-helper">{helperText}</div>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
