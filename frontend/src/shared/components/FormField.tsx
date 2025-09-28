import type { ReactNode } from 'react';

/**
 * FormField component that wraps form inputs with consistent styling and validation display
 * @param label - The label text for the form field
 * @param required - Whether the field is required (adds asterisk to label)
 * @param error - Error message to display (also applies error styling)
 * @param children - The form input element(s) to wrap
 * @param className - Additional CSS classes to apply
 */
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={`form-group ${error ? 'error' : ''} ${className}`}>
      <label className="form-label" data-required={required}>
        {label}
      </label>
      {children}
    </div>
  );
}